const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const coveralls = require('gulp-coveralls');
const shell = require('gulp-shell');
const exit = require('gulp-exit');
const server = require('./mock_servers/kafka/server');
const dependentServer = require('./mock_servers/{dependency}/server');
const producer = require('./kafka_producer');

gulp.task('coverage-setup', () => (
  gulp.src(['./controllers/*.js', './models/*.js', './event_handlers/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
));

gulp.task('db:migrate', shell.task([
  'node_modules/.bin/sequelize db:migrate',
]));

gulp.task('coveralls', () => (
  gulp.src('./coverage/lcov.info')
    .pipe(coveralls())
    .pipe(exit())
));

gulp.task('start:server', () => server.start());
gulp.task('start:producer', () => producer.start());
gulp.task('start:dependent', () => dependentServer.start());

gulp.task('server:test', ['coverage-setup'], () => (
  gulp.src(['./tests/controllers/*.js', './tests/models/*.js', './tests/event_handlers/*.js'])
    .pipe(mocha())
    .on('error', () => {
      server.forceShutdown();
      dependentServer.forceShutdown();
    })
    .pipe(istanbul.writeReports({
      dir: './coverage',
    }))
));

gulp.task('test', ['start:server', 'start:producer', 'start:dependent', 'server:test'], () => {
  server.forceShutdown();
  dependentServer.forceShutdown();
  exit();
  process.exit(0);
});
