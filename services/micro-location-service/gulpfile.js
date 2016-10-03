/* eslint-disable import/no-extraneous-dependencies */

const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const coveralls = require('gulp-coveralls');
const shell = require('gulp-shell');
const exit = require('gulp-exit');
require('dotenv').config({ silent: true });
global.models = require('./models');
const producer = require('./kafka_producer');
const usersServer = require('./shared/users/server');
const levelsServer = require('./shared/levels/server');
require('dotenv').config();

gulp.task('coverage-setup', () => (
  gulp.src(['./controllers/*.js', './models/*.js', './event_handlers/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
));

gulp.task('start:dependent', () => {
  usersServer.start();
  levelsServer.start();
});

gulp.task('db:migrate', shell.task([
  'node_modules/.bin/sequelize db:migrate',
]));

gulp.task('coveralls', () => (
  gulp.src('./coverage/lcov.info')
    .pipe(coveralls())
    .pipe(exit())
));

gulp.task('start:producer', () => producer.start());

gulp.task('server:test', ['db:migrate', 'coverage-setup'], () => (
  gulp.src(['./tests/controllers/*.js', './tests/models/*.js', './tests/event_handlers/*.js'])
    .pipe(mocha())
    .on('error', () => {
      usersServer.forceShutdown();
      levelsServer.forceShutdown();
    })
    .pipe(istanbul.writeReports({
      dir: './coverage',
    }))
));

gulp.task('test', ['start:dependent', 'server:test'], () => {
  exit();
  usersServer.forceShutdown();
  levelsServer.forceShutdown();
  exit();
  process.exit(0);
});
