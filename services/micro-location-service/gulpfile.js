const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const models = require('./models');
const coveralls = require('gulp-coveralls');
const exit = require('gulp-exit');
const server = require('./mock_servers/kafka/server');
const dependentServer = require('./mock_servers/{dependency}/server');
const producer = require('./kafka_producer');

gulp.task('coverage-setup', () => (
  gulp.src(['./controllers/*.js', './models/*.js', './event_handlers/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
));

gulp.task('coveralls', () => (
  gulp.src('./coverage/lcov.info')
    .pipe(coveralls())
    .pipe(exit())
));

gulp.task('db:create', () => models.sequelize.sync().then(exit()));

gulp.task('start:server', () => server.start());
gulp.task('start:producer', () => producer.start());
gulp.task('start:dependent', () => dependentServer.start());

gulp.task('server:test', ['db:create', 'coverage-setup'], () => (
  gulp.src(['./tests/controllers/*.js', './tests/models/*.js', './tests/event_handlers/*.js'])
    .pipe(mocha())
    .pipe(istanbul.writeReports({
      dir: './coverage',
    }))
));

gulp.task('test', ['start:server', 'start:producer', 'start:dependent', 'server:test'], () => {
  server.forceShutdown();
  assessmentServer.forceShutdown();
  exit();
  process.exit(0);
});
