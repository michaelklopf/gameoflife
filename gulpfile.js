var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
// var using = require('gulp-using'); // can be used to show processed files in terminal

gulp.task('browserify', function() {
    gulp.src('static/js/main.js')
      .pipe(browserify())
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy', function() {
    gulp.src('views/index.html')
      .pipe(gulp.dest('./dist'));
});

gulp.task('default',['browserify', 'copy']);

gulp.task('watch', function() {
    gulp.watch('static/**/*.*', ['default']);
});
