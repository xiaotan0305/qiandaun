var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
// 路径处理插件
var path = require('path');
// 删除模块
var del = require('del');
// 单文件路径使用，删除单个文件路径
var single = '';
// 构建路径
var buildPre = 'build/';
// 本地对应ftp路径的默认路径
var srcPre = 'dev/js/';
// 匹配所有目录下的js文件
var exp = '*.js';
// 压缩配置
var uglifyConfig = {
    // 混淆变量名
    mangle: true,
    // 输出时将所有的中文转换为unicode
    output: {ascii_only: true}
};
// 任务操作路径配置
defaultConfig = {
    src: [srcPre +  exp],
    del: buildPre +  single
};
gulp.task('build', function() {


});

gulp.task('watch', ['build'], function() {
    gulp.watch(paths.js, ['build']);
});
gulp.task('del', function() {
    return del(defaultConfig.del);
});
// 在del执行之后执行压缩任务
gulp.task('uglify', ['del'], function() {
    return gulp.src(defaultConfig.src).pipe(uglify(uglifyConfig)).pipe(gulp.dest(function(path) {
        // 系统差异适用的目录分割符，默认为mac分割符
        var exp = '/';
        // defaultConfig.dest
        var buildPath = path.path;console.log(buildPath);
        // 如果目录路径存在\说明运行环境为windows浏览器，则修改目录分割符为\
        if (buildPath.indexOf('\\') > -1) {
            exp = '\\';
            // 将资源路径更换为已\分割
            srcPre = srcPre.replace(/\//g, exp);
        }
        // 资源地址替换为输出地址
        buildPath = buildPath.replace(srcPre, buildPre);
        buildPath = buildPath.substring(0, buildPath.lastIndexOf(exp) + 1);
        // 将js文件名去掉改为目录地址，兼容双系统区别\和/
        // buildPath = buildPath.replace(/[\/|\\][0-9a-z-]*\.js/i, '') + exp;
        return buildPath;
    }));
});

gulp.task('default', ['uglify']); //, 'watch'