const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

function buildStyles() {
  return gulp.src('src/scss/**/*.scss') 
    .pipe(sass().on('error', sass.logError))
    .pipe(import('gulp-autoprefixer').then(module => module.default())) 
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));
}

function watchTask() {
  gulp.watch('src/scss/**/*.scss', buildStyles);
}

module.exports.default = gulp.task(watchTask);
