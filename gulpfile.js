var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minCss = require('gulp-minify-css');
var pipe = require('gulp-pipe');
var yargs = require('yargs').argv;
var del = require('del');
var chalk = require('chalk');
var plumber = require('gulp-plumber');
// gulp的ftp插件
var ftp = require('vinyl-ftp');
var path = require('path');
var pathConfig = {
    // 活动
    a: 'm_activity/',
    // 到modules一级
    m: 'm_public/jslib/modules/',
    // 到jslib一级
    j: 'm_public/jslib/',
    // 到public/一级
    p: 'm_public/',
    // 到public/一级
    c: 'm_public/201511/css/',
    // 到public/一级
    i: 'm_public/201511/images/',
    // 到pc_public/一级
    x: 'pc_public/',
    // 根目录
    b: './'
};
// gulp初始输入地址
var url = '';
// gulp初始输出地址
var destPath = 'build';

// 动态获取key 后面正则需要用到
var pathConfigArr = [];
for (var conKey in pathConfig) {
    if (pathConfig.hasOwnProperty(conKey)) {
        pathConfigArr.push(conKey);
    }
}
var pathConfigReg = new RegExp('[' + pathConfigArr.join('') + ']');


// 判断传入的参数
var yargsArr = [];
for (var name in yargs) {
    // -o为定义输出路径
    if (yargs.hasOwnProperty(name) && !/_|\$0/.test(name) && name !== 'o') {
        yargsArr.push(yargs[name]);
    }
}
var yargsStr = yargsArr.join('|');
// 处理本地资源路径
for (var key in yargs) {
    if (yargs.hasOwnProperty(key) && pathConfigReg.test(key)) {
        if (yargsStr) {
            url = pathConfig[key] + yargsStr.replace(/\|?true\|?/g, '');
        } else {
            url = pathConfig[key];
        }
    }
}

// t:测试 z:正式
var t = false,
    z = false,
    ftpConfig = {};
// 处理FTP资源路径
var basePath = url;
var urlArr = url.split('/');
var urlArrLen = urlArr.length;
if (urlArrLen) {
    var last = urlArr[urlArrLen - 1];
    if (/.+\.\w+/.test(last) || !last) {
        urlArr.pop();
    }
    basePath = urlArr.join('/');
}

// 自定义输出路径
var o = false;
if (yargs.o && typeof yargs.o !== 'boolean') {
    o = true;
    destPath = path.join(basePath, yargs.o);
}

// 区FTP测试和正式配置
if (yargs.t) {
    t = true;
    basePath = 'common_m/' + (o ? destPath : basePath);
    ftpConfig = {
        host: '218.30.110.109',
        user: 'js_test',
        pass: 'fie93k32'
    };
} else if (yargs.z) {
    z = true;
    ftpConfig = {
        host: '218.30.110.109',
        user: 'common_m_tankunpeng',
        pass: 'e3Df5332'
    };
}
var conn = ftp.create(ftpConfig);

/**
 * 获取读取文件列表文件
 * @param {any} pt
 * @param {any} err
 * @param {any} files
 */
function getFiles(pt, arr) {
    var floag = false;
    var regArr = ['node_modules\/', 'gulpfile\.js', 'build\/'];
    arr && (regArr = regArr.concat(arr));
    var ig = new RegExp(regArr.join('|'));
    return function (err, files) {
        var len = files.length;
        if (err) return console.log(err);
        if (len) {
            if (!floag) {
                console.log(chalk.cyan('读取文件列表:'));
                floag = true;
            }
            // console.log(files);
            for (var i = 0, fileLen = files.length; i < fileLen; i++) {
                var file = files[i];
                if (!ig.test(file)) {
                    console.log(chalk.cyan(file));
                }
            }

            return files;
        }
        console.log(chalk.yellow('提示:路径 ' + pt + ' 下未找到符合条件的文件'));
    };
}


console.log(chalk.green('最终gulp路径：' + url));
console.log(chalk.green('最终本地输出路径：' + destPath));
if (t || z) {
    console.log(chalk.green('最终ftp路径：' + basePath));
}
gulp.task('del', function() {
    return del(path.join(destPath, './**/*')).then(function(paths) {
        if (paths.length) {
            console.log(chalk.yellow('删除文件和文件夹:\n'), chalk.yellow(paths.join('\n')));
        }
    });
});
gulp.task('css', function() {
    var arr = [plumber(), minCss(), gulp.dest(destPath)];
    if (t) {
        arr.splice(1, 1, conn.newer(basePath), conn.dest(basePath));
    } else if (z) {
        arr.splice(2, 0, conn.newer(basePath), conn.dest(basePath));
    }
    var src = url.indexOf('.css') !== -1 ? url : url + '/**/*.css';
    return pipe(gulp.src(src, getFiles(src)), arr);
});
gulp.task('js', function() {
    var arr = [plumber(), uglify({
        mangle: true,
        output: {
            ascii_only: true
        }
    }), gulp.dest(destPath)];
    if (t) {
        arr.splice(1, 1, conn.newer(basePath), conn.dest(basePath));
    } else if (z) {
        arr.splice(2, 0, conn.newer(basePath), conn.dest(basePath));
    }
    var src = url.indexOf('.js') !== -1 ? url : url + '/**/*.js';
    return pipe(gulp.src(src, getFiles(src)), arr);
});
gulp.task('img', function() {
    var arr = [plumber(), gulp.dest(destPath)];
    if (t || z) {
        arr.splice(1, 0, conn.newer(basePath), conn.dest(basePath));
    }
    var src = url.indexOf('.+(jpg|png|gif)') !== -1 ? url : url + '/**/*.+(jpg|png|gif)';
    return pipe(gulp.src(src, getFiles(src)), arr);
});

gulp.task('default', ['del'], function() {
    if (!url) {
        console.log(chalk.yellow('\ngulp警告: 参数为空!!!\n'));
        return false;
    }
    gulp.start('css', 'js', 'img');
});