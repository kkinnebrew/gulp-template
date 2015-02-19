var gulp = require('gulp');

var browserify = require('browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var fs = require('fs');
var openBrowser = require('open');
var sequence = require('run-sequence');
var bowerResolve = require('bower-resolve');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var coffeeify = require('coffeeify');
var connect = require('gulp-connect');
var rimraf = require('gulp-rimraf');
var livereload = require('gulp-livereload');
var stringify = require('stringify');

var hbsfy = require('hbsfy').configure({
  extensions: ['hbs']
});

var name = require('./package.json').name;
var version = require('./package.json').version;
var dependencies = require('./bower.json').dependencies;

// images

gulp.task('images', function() {
  return gulp.src(['./app/images/**/*'])
    .pipe(gulp.dest('build/assets'))
    .pipe(livereload());
});

// styles

gulp.task('styles:scss', function() {
  return gulp.src(['./app/styles/**/*.scss'])
    .pipe(sass())
    .pipe(concat('styles.sass.css'))
    .pipe(gulp.dest('tmp/css'));
});

gulp.task('styles:css', function() {
  return gulp.src(['./app/styles/**/*.css'])
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('tmp/css'));
});

gulp.task('styles:concat', function() {
  return gulp.src('./tmp/css/**/*.css')
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('build/'))
    .pipe(livereload());
});

gulp.task('styles', function(callback) {
  sequence(['styles:scss', 'styles:css'], 'styles:concat', callback);
});

// scripts

gulp.task('scripts', function() {

  bowerResolve.init(function () {

    var bundler = browserify();

    for (var pkg in dependencies) {
      bundler.require(bowerResolve(pkg), { expose: pkg });
    }

    bundler.bundle()
      .pipe(source('vendor.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      //.pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build/'));

  });

  bowerResolve.init(function () {

    var bundler = browserify({
      basedir: './app',
      entries: ['./scripts/app.js'],
      debug: true
    });

    for (var pkg in dependencies) {
      bundler.external(pkg);
    }

    bundler
      .transform(coffeeify)
      .transform(hbsfy)
      .transform(stringify(['.html']))
      .bundle()
      .pipe(source('app.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      //.pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build/'))
      .pipe(livereload());

  });

});

// html

gulp.task('html', function() {

  gulp.src('app/*.html')
    .pipe(gulp.dest('build/'))
    .pipe(livereload());

});

// cleaning

gulp.task('clean', function() {
  return gulp.src(['build', 'tmp'], { read: false })
    .pipe(rimraf());
});

gulp.task('clean:tmp', function() {
  return gulp.src('tmp')
    .pipe(rimraf());
});

// serving

gulp.task('server', ['build'], function() {
  connect.server({
    root: 'build',
    port: 8888
  });
  openBrowser('http://localhost:8888');
});

// building

gulp.task('build', function(callback) {
  sequence('clean', ['styles', 'images', 'html', 'scripts'], 'clean:tmp', callback);
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('app/scripts/**/*', ['scripts']);
  gulp.watch('app/styles/**/*', ['styles']);
  gulp.watch('app/*.html', ['html']);
});

// default

gulp.task('default', ['build']);
