'use strict';

var gulp = require('gulp');

gulp.paths = {
  devel: 'default',
  production : 'production',
  test: 'test',
  server: 'server'
};

require('require-dir')('./gulp');

gulp.task('default', ['clean', 'jshint', 'sass', 'build-less', 'csslint', 'images', 'develop','watch'], function () {
    gulp.start('develop');
});
