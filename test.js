var fs = require('fs');
var gulp = require('gulp');
var browserify = require('browserify');
var debowerify = require('debowerify');
var bowerResolve = require('bower-resolve');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var coffeeify = require('coffeeify');

var hbsfy = require('hbsfy').configure({
  extensions: ['hbs']
});

var name = require('./package.json').name;
var version = require('./package.json').version;
var dependencies = require('./bower.json').dependencies;

bowerResolve.init(function () {

  var bundler = browserify();

  for (var pkg in dependencies) {
    bundler.require(bowerResolve(pkg), { expose: pkg });
  }

  bundler.bundle()
    .pipe(source(version + '.vendor.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));

});

bowerResolve.init(function () {

  var bundler = browserify({
    basedir: './app',
    entries: ['./js/app.js'],
    debug: true
  });

  for (var pkg in dependencies) {
    bundler.external(bowerResolve(pkg));
  }

  bundler
    .transform(coffeeify)
    .transform(hbsfy)
    .transform(debowerify)
    .bundle()
    .pipe(source(version + '.' + name + '.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    //.pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));

});