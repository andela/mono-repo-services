const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const models = require('./models');
const coveralls = require('gulp-coveralls');
const exit = require('gulp-exit');
const server = require('./server');

gulp.task('coverage-setup', () => (
  gulp.src(['./controllers/*.js', './models/*.js', './event_handlers/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
));

gulp.task('coveralls', () => (
  gulp.src('./tests/coverage/lcov.info')
    .pipe(coveralls())
    .pipe(exit())
));

gulp.task('db:create', () => models.sequelize.sync().then(exit()));

gulp.task('start:server', () => server.start());

gulp.task('server:test', ['db:create', 'coverage-setup'], () => (
  gulp.src(['./tests/controllers/*.js', './tests/models/*.js', './tests/event_handlers/*.js'])
    .pipe(mocha())
    .pipe(istanbul.writeReports({
      dir: './tests/coverage',
    }))
));

gulp.task('test', ['start:server', 'server:test'], () => {
  server.forceShutdown();
  exit();
  process.exit(0);
  return;
});
gulp.task('build');
