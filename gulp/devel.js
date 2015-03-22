'use strict';


var gulp = require('gulp'),
  sass = require('gulp-sass'),
  less = require('gulp-less'),
  imagemin = require('gulp-imagemin'),
  gulpLoadPlugins = require('gulp-load-plugins');

var del = require('del'),
  path = require('path'),
  util = require('util'),
  through = require('through'),
  karma = require('karma').server;

var plugins = gulpLoadPlugins();
var paths = {
    js: ['*.js', '!node_modules/**', 'test/**/*.js', '!test/coverage/**', '!bower_components/**', 'packages/**/*.js', '!packages/**/node_modules/**', '!packages/contrib/**/*.js', '!packages/contrib/**/node_modules/**'],
    html: ['packages/**/public/**/views/**', 'packages/**/server/views/**'],
    css: ['!bower_components/**', 'packages/**/public/**/css/*.css', '!packages/contrib/**/public/**/css/*.css'],
    sass: ['!bower_components/**', 'scss/*.scss', '!packages/contrib/**/public/**/scss/*.scss'],
    less: ['less/*.less'],
    images: ['images/*.png', 'images/*.jpg']
  };

gulp.task('help', plugins.taskListing);
var defaultTasks = ['clean', 'jshint', 'sass', 'build-less', 'csslint', 'images', 'develop','watch'];

gulp.task('clean', function (cb) {
  return del(['bower_components/build'], cb);
});

gulp.task('jshint', function () {
  return gulp.src(paths.js)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'))
    .pipe(count('jshint', 'files lint free'));
});

gulp.task('sass', function () {
   return gulp.src(paths.sass)
       .pipe(sass())
       .pipe(gulp.dest('packages/system/public/assets/css'));
});

gulp.task('build-less', function(){
    return gulp.src(paths.less)
        .pipe(less())
        .pipe(gulp.dest('bower_components/bootstrap/dist/css'));
});

gulp.task('csslint', function () {
  return gulp.src(paths.css)
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.reporter())
    .pipe(count('csslint', 'files lint free'));
});

gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('packages/system/public/assets/img'));
});

gulp.task('develop', ['env:develop'], function () {
  plugins.nodemon({
    script: 'server.js',
    ext: 'html js',
    env: { 'NODE_ENV': 'development' } ,
    ignore: ['./node_modules/**'],
    nodeArgs: ['--debug']
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.js, ['jshint']).on('change', plugins.livereload.changed);
  gulp.watch(paths.html).on('change', plugins.livereload.changed);
  gulp.watch(paths.sass, ['sass']).on('change', plugins.livereload.changed);
  //gulp.watch(paths.css, ['csslint']).on('change', plugins.livereload.changed);
  gulp.watch(paths.less, ['less']).on('change', plugins.livereload.changed);

  plugins.livereload.listen({interval: 1000});
});

gulp.task('default', defaultTasks);

function count(taskName, message) {
  var fileCount = 0;

  function countFiles(file) {
    fileCount++; // jshint ignore:line
  }

  function endStream() {
    //gutil.log(gutil.colors.cyan(taskName + ': ') + fileCount + ' ' + message || 'files processed.');
    this.emit('end'); // jshint ignore:line
  }

  return through(countFiles, endStream);
}
