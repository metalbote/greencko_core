const gulp = require('gulp'),
    runSequence = require('run-sequence').use(gulp),
    gulpRequireTasks = require('gulp-require-tasks');

global.config = {buildSourceMaps: 1};


gulpRequireTasks({
  path: process.cwd() + '/.gulp-tasks',
});

gulp.task('default', ['watch']);

gulp.task('watch', ['styles:watch']);

gulp.task('clean', function (callback) {
  runSequence(['styles:clean'],
      callback);
});

gulp.task('build', function (callback) {
  runSequence('clean',
      ['styles:build'],
      callback);
});

