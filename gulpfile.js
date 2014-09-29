var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var using = require('gulp-using');

gulp.task('browserify', function() {
    gulp.src('static/js/main.js')
      .pipe(using())
      .pipe(browserify({transform: 'reactify'}))
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
