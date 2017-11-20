/**
 * 房贷计算器工具自动化
 * by blue
 */
var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
gulp.task('del', function () {
    return del('build/');
});
gulp.task('uglify', function () {
    return gulp.src(['build/main.js','worldJisuan.js']).pipe(uglify({
        // 混淆变量名
        mangle: true,
        // 输出时将所有的中文转换为unicode
        output: {ascii_only: true}
    })).pipe(gulp.dest('output'));
});
gulp.task('concat', function () {
    return gulp.src(['main.js', './mvc/**/*.js']).pipe(concat('main.js')).pipe(gulp.dest('build/'));
});
gulp.task('test', ['del', 'concat']);
gulp.task('ofc', ['del', 'concat', 'uglify']);


