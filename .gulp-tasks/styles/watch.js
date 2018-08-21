'use strict';

module.exports = function (gulp) {
  return gulp.watch(['assets/scss/**/*.scss'], ['styles:build']);
};
