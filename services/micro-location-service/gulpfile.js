/* eslint-disable import/no-extraneous-dependencies */

const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const codeclimate = require('gulp-codeclimate-reporter');
const shell = require('gulp-shell');
const exit = require('gulp-exit');
require('dotenv').config({ silent: true });
global.models = require('./models');
const server = require('./server');
const usersServer = require('./shared/user/server');
const levelsServer = require('./shared/level/server');

gulp.task('coverage-setup', () => (
  gulp.src(['./controllers/*.js', './models/*.js', './events/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
));

gulp.task('start:server', () => server.start());

gulp.task('start:dependent', () => {
  usersServer.start();
  levelsServer.start();
});

gulp.task('db:migrate', shell.task([
  'node_modules/.bin/sequelize db:migrate',
]));

gulp.task('codeclimate', () => (
  gulp.src('./coverage/lcov.info')
    .pipe(codeclimate({ token: process.env.CODECLIMATE_REPO_TOKEN }))
    .pipe(exit())
));

gulp.task('server:test', ['db:migrate', 'coverage-setup'], () => (
  gulp.src(
    [
      './tests/controllers/*.js',
      './tests/models/*.js',
      './tests/endpoints/*.js',
      './tests/events/*.js',
    ])
    .pipe(mocha())
    .on('error', () => {
      usersServer.forceShutdown();
      levelsServer.forceShutdown();
    })
    .pipe(istanbul.writeReports({
      dir: './coverage',
    }))
));

gulp.task('test', ['start:server', 'start:dependent', 'server:test'], () => {
  exit();
  usersServer.forceShutdown();
  levelsServer.forceShutdown();
  exit();
  process.exit(0);
});
