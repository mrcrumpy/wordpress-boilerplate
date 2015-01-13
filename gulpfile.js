'use strict';

var SRC_PATH = './src';
var DIST_PATH = './dist';
var TMP_PATH = './.tmp';

// TODO:
// gulp notify
// js vendor
// test (karma?)

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var to5ify = require('6to5ify');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var rev = require('gulp-rev');
var memRev = require('./utils/gulp-memrev');
var del = require('del');
var cache = require('gulp-cached');
var imagemin = require('gulp-imagemin');

var DIST = false;
var CURRENT_PATH = TMP_PATH;

gulp.task('clean', function (done) {
  del([TMP_PATH, DIST_PATH], done);
});

gulp.task('html', function () {
  var stream = gulp.src(SRC_PATH + '/**/*.html');
  if (DIST) {
    stream.pipe(memRev.replace())
      .pipe(gulp.dest(CURRENT_PATH));
  } else {
    stream.pipe(connect.reload());
  }
  return stream;
});

gulp.task('images', function () {
  return gulp.src([SRC_PATH + '/images/**/*'])
    .pipe(imagemin())
    .pipe(gulp.dest(CURRENT_PATH + '/images'));
});

gulp.task('connect', function () {
  connect.server({
    root: [SRC_PATH, TMP_PATH],
    livereload: true
  });
});

gulp.task('watch', ['connect'], function () {
  gulp.watch(SRC_PATH + '/**/*.html', ['html']);
  gulp.watch(SRC_PATH + '/**/*.scss', ['sass']);
  gulp.watch(SRC_PATH + '/**/*.js',   ['browserify']);
});

gulp.task('serve', function (done) {
  runSequence('lint', ['browserify', 'sass'], 'watch', done);
});

gulp.task('sass', function () {
  return gulp.src(SRC_PATH + '/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: './bower_components'
    }))
    .pipe(sourcemaps.write())
    .pipe(rev())
    .pipe(memRev())
    .pipe(gulp.dest(CURRENT_PATH + '/css/'));
});

gulp.task('browserify', ['lint'], function() {

  var bundler = browserify({
    entries: [SRC_PATH + '/js/index.js'],
    debug: !DIST
  });

  var bundle = function() {
    var stream = bundler
    	.transform(to5ify)
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer());
    if (DIST) {
      stream.pipe(uglify())
      .pipe(rev())
      .pipe(memRev());
    }
    stream.pipe(gulp.dest(CURRENT_PATH + '/js/'));
    if (!DIST) stream.pipe(connect.reload());
    return stream;
  };

  return bundle();
});

gulp.task('lint', function () {
  var stream = gulp.src(SRC_PATH + '/js/**/*.js')
    .pipe(cache('linting'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
  if (DIST) {
    stream.pipe(jshint.reporter('fail'));
  }
  return stream;
});

gulp.task('dist', function (done) {
  DIST = true;
  CURRENT_PATH = DIST_PATH;
  runSequence('clean', 'lint', ['browserify', 'sass', 'images'], 'html', done);
});

gulp.task('default', ['serve']);
