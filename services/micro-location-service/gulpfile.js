'use strict';

var gulp = require('gulp'),
  istanbul = require('gulp-istanbul'),
  mocha = require('gulp-mocha'),
  shell = require('gulp-shell'),
  models = require('./models'),
  nodemon = require('gulp-nodemon'),
  coveralls = require('gulp-coveralls'),
  exit = require('gulp-exit'),
  server = require('./server');

gulp.task('coverage-setup', function () {
  return gulp.src(['./controllers/*.js', './models/*.js', './event_handlers/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('coveralls', function () {
  gulp.src('./test/coverage/lcov.info')
    .pipe(coveralls())
    .pipe(exit());
});

gulp.task('db:sync', function () {
  return models.sequelize.sync().then(exit());
});

gulp.task('start:server', function () {
  return server.start();
});

gulp.task('server:test', ['db:sync', 'coverage-setup'], function () {
  return gulp.src(['./test/controllers/*.js', './test/models/*.js', './test/event_handlers/*.js'])
    .pipe(mocha())
    .pipe(istanbul.writeReports({
      dir: './test/coverage'
    }));
});

gulp.task('test', ['start:server', 'server:test'], function () {
  server.forceShutdown();
  exit();
  process.exit(0);
  return;
});
gulp.task('build');
