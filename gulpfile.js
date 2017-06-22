'use strict';

var SRC_PATH = './src/underscores';
var DIST_PATH = './public/content/themes/underscores';

var TMP_PATH = DIST_PATH;

var gulp = require('gulp');
var g = require('gulp-load-plugins')();

var runSequence = require('run-sequence');
var memRev = require('./utils/gulp-memrev');
var del = require('del');
var to5ify = require('babelify');
var karma = require('karma');

var DIST = false;
var CURRENT_PATH = TMP_PATH;


gulp.task('clean', () => { del([TMP_PATH, DIST_PATH], {dot: true}); });

gulp.task('views', function () {
  var stream = gulp.src([
    SRC_PATH + '/**/*.php',
    SRC_PATH + '/screenshot.png',
    SRC_PATH + '/js/*.js',
    '!' + SRC_PATH + '/js/index.js'
    ],
    { base: SRC_PATH });


  stream = stream.pipe(gulp.dest(CURRENT_PATH));

  if (!DIST) {
    stream = stream.pipe(g.livereload());
  }

  return stream;
});

gulp.task('images', function () {
   var stream = gulp.src([SRC_PATH + '/images/**/*']);
    if (DIST) {
      stream = stream.pipe(g.imagemin());
    }
    return stream.pipe(gulp.dest(CURRENT_PATH + '/images'));
});

gulp.task('assets', function () {
    return gulp.src([
      SRC_PATH + '/fonts/**/*'
      // , ... more
    ], { base : SRC_PATH })
    .pipe(gulp.dest(CURRENT_PATH));
});

gulp.task('sass', function () {
  var stream = gulp.src(SRC_PATH + '/sass/style.scss')
    .pipe(g.plumber({errorHandler: g.notify.onError('Sass: <%= error.message %>')}))
    .pipe(g.sourcemaps.init())
    .pipe(g.sass({
      includePaths: [
        './bower_components',
        './node_modules'
      ]
    }))
    .pipe(g.autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
        remove: true
      }));

  if (DIST) {
    stream = stream
      .pipe(g.minifyCss());
  } else {
    stream = stream
      .pipe(g.sourcemaps.write())
      .pipe(g.livereload());
  }

  return stream.pipe(gulp.dest(DIST_PATH));
});

gulp.task('browserify', ['lint'], function() {
  var stream = gulp.src(SRC_PATH + '/**/js/index.js')
    .pipe(g.plumber({errorHandler: g.notify.onError('Browserify: <%= error.message %>')}))
    .pipe(g.browserify2({
      fileName: 'bundle.js',
      transform: to5ify,
      options: {
        debug: !DIST
      }
    }));

  if (DIST) {
    stream = stream
      .pipe(g.uglify());
  }

  stream = stream.pipe(gulp.dest(CURRENT_PATH + '/js'));

  if (!DIST) stream = stream.pipe(g.livereload());
  return stream;
});


gulp.task('watchfiles', function () {
  gulp.watch([
    SRC_PATH + '/**/*.php'
     ], ['views']);

  // gulp.watch(SRC_PATH + '/**/*.html', ['html']);
  gulp.watch(SRC_PATH + '/**/*.scss', ['sass']);
  gulp.watch(SRC_PATH + '/**/*.js',   ['browserify']);
});

gulp.task('watch', function (done) {
  g.livereload.listen();
  runSequence('clean', 'lint', [ 'browserify' ,'sass', 'assets', 'images', 'views'], 'watchfiles', done);
});

gulp.task('lint', function () {
  return gulp.src(SRC_PATH + '/**/js/**/*.js')
    .pipe(g.plumber({errorHandler: g.notify.onError('<%= error.message %>')}))
    .pipe(g.cached('linting'))
    .pipe(g.jshint())
    .pipe(g.jshint.reporter('jshint-stylish'))
    .pipe(g.jshint.reporter('fail'));
});

gulp.task('test', function (done) {
  karma.runner.run({port: 9876}, function(exitCode) {
    if (exitCode) return done('Karma tests failed');
    return done();
  });
});

gulp.task('dist', function (done) {
  DIST = true;
  CURRENT_PATH = DIST_PATH;
  runSequence('clean', 'lint', [ 'browserify', 'sass', 'images', 'assets', 'views'], done); 
});

gulp.task('default', ['watch']);
