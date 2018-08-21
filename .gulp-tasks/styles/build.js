'use strict';

const autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-clean-css'),
    gulpif = require('gulp-if'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    stripCssComments = require('gulp-strip-css-comments');

module.exports = function (gulp) {
  return gulp.src(["assets/scss/**/*.scss"])
      .pipe(plumber())
      .pipe(gulpif(global.config.buildSourceMaps, sourcemaps.init({debug: true})))
      .pipe(
          sass({
            outputStyle: 'compressed',
            precision: 10,
          }).on('error', sass.logError))
      .pipe(autoprefixer(["last 2 version", "> 5%", "IE 9"], {cascade: true}))
      .pipe(stripCssComments({preserve: false}))
      .pipe(cssmin())
      .pipe(gulpif(global.config.buildSourceMaps, sourcemaps.write()))
      .pipe(gulp.dest('css'));
};
