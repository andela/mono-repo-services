/* eslint-disable import/no-extraneous-dependencies */

const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const coveralls = require('gulp-coveralls');
const shell = require('gulp-shell');
const exit = require('gulp-exit');
const producer = require('./kafka_producer');
const models = require('./models');
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

gulp.task('db:sync', () => {
  models.sequelize.sync();
});

gulp.task('start:producer', () => producer.start());

gulp.task('server:test', ['coverage-setup'], () => (
  gulp.src(['./tests/controllers/*.js', './tests/models/*.js', './tests/event_handlers/*.js'])
    .pipe(mocha())
    .on('error', (err) => {
      console.log(err);
    })
    .pipe(istanbul.writeReports({
      dir: './coverage',
    }))
));

gulp.task('test', ['db:sync', 'start:dependent', 'server:test'], () => {
  exit();
  usersServer.forceShutdown();
  levelsServer.forceShutdown();
  exit();
  process.exit(0);
});
