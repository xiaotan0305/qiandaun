/*
创建Gulp配置文件
 */

const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
// CSS规范排序
const csscomb = require('gulp-csscomb');

const pipe = require('gulp-pipe');
// 引入功能组件
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');

// 错误处理
const plumber = require('gulp-plumber');

// 开发辅助
// 美化日志
const chalk = require('chalk');
// gulp combo插件
const fangfisCombo = require('gulp-fangfis-combo');
// 生成文件流
const Vinyl = require('vinyl');
const stream = require('stream');

// 设置相关路径
const paths = {
    static: 'static',
    dev: 'dev',
    sass: 'dev/css/scss/**/*',
    js: 'dev/js/**/*',
    main: ['dev/js/entry/index.js', 'dev/js/entry/upload.js', 'dev/js/entry/login.js'],
    base: 'dev/js',
    font: 'dev/fonts/**/*'
};

let writeAsyncFile = function (fileData, base, dest) {
    // 接受回传异步模块数组
    fileData.forEach(function (item) {
        var readable = stream.Readable({
            objectMode: true
        });
        readable._read = function () {
            this.push(new Vinyl({
                path: item.path,
                base: base,
                contents: new Buffer(item.contents)
            }));
            this.push(null);
        };
        var arr = [
            readable,
            plumber(),
            babel(),
            replace(/\/\/#\s*sourceMappingURL=.+\.map\?\w+/g, ''),
            sourcemaps.init({
                loadMaps: true
            }),
            uglify({
                mangle: true,
                output: {
                    ascii_only: true
                }
            }),
            sourcemaps.write('./maps'),
            replace(/\.js\.map(\?_\w+)?/g, '.js.map?_' + Math.random().toString(32).substring(2)),
            gulp.dest(dest)
        ];
        return pipe(arr)
            .on('end', function () {
                console.log(chalk.green('[已完成] 异步模块 ' + item.origId));
            });
    });
};

// Sass 处理
gulp.task('sass', function () {
    console.log(chalk.yellow('[进行中] sass'));
    gulp.src(paths.sass)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: [
                'Chrome >= 20',
                'Firefox > 24',
                'Explorer >= 8',
                'iOS > 7',
                'Android >= 4'
            ]
        }))
        .pipe(csscomb())
        .pipe(concat('all.css'))
        .pipe(gulp.dest(`${paths.static}/css/`))
        .pipe(cleancss())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest(`${paths.static}/css/`))
        .on('end', function () {
            console.log(chalk.green('[已完成] sass'));
        });
});

// font处理
gulp.task('font',function () {
    console.log(chalk.yellow('[进行中] fonts'));
    let arr = [
        gulp.src(paths.font),
        gulp.dest(`${paths.static}/fonts`)
    ];
    return pipe(arr)
    .on('end', function () {
        console.log(chalk.green('[已完成] fonts'));
    });
});

// js处理
gulp.task('js', function () {
    console.log(chalk.yellow('[进行中] js(Entry js file)'));
    let arr = [
        gulp.src(paths.main, { base: paths.base }),
        plumber(),
        fangfisCombo(Object.assign({
            base: paths.base
        }, {
            ignore: ['jquery'],
            config: {
                alias: {
                    jquery: 'jquery'
                }
            }
        }), function (cons) {
            // cons Array 数组类型 回传异步模块合并后的异步模块数组
            writeAsyncFile(cons, paths.base, `${paths.static}/js`);
        }),
        babel(),
        replace(/\/\/#\s*sourceMappingURL=.+\.map\?\w+/g, ''),
        sourcemaps.init({
            loadMaps: true
        }),
        uglify({
            mangle: true,
            output: {
                ascii_only: true
            }
        }),
        sourcemaps.write('./maps'),
        replace(/\.js\.map(\?_\w+)?/g, '.js.map?_' + Math.random().toString(32).substring(2)),
        gulp.dest(`${paths.static}/js`)
    ];
    return pipe(arr)
        .on('end', function () {
            console.log(chalk.green('[已完成] js(Entry js file)'));
        });
});

/**
 * 文件变更监听
 * $ gulp watch
 */

gulp.task('watch', function () {
    console.log(chalk.green('[监听] 启动gulp watch自动编译'));
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['js']);
});

gulp.task('default', ['watch', 'sass', 'js','font']);