var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-minify-css');
var clean = require('gulp-clean');
var bump = require('gulp-bump');
var sequence = require('run-sequence');
var browserify = require('gulp-browserify');
var rename = require("gulp-rename");
var handlebars = require('gulp-compile-handlebars');
var extreplace = require('gulp-ext-replace');
var watch = require('gulp-watch');
var express = require('express');

var pkg = require('./package.json');
var files = require('./config/shim.json');

var paths = {
  'src': {
    'sass': 'app/css/**/*.scss',
    'css': 'app/css/**/*.css'
  },
  'dest': {
    'js': 'scripts.js',
    'css': 'styles.css'
  }
}

// styles

gulp.task('styles:scss', function() {
  return gulp.src(paths.src.sass)
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concat('styles.sass.css'))
    .pipe(gulp.dest('tmp/css'));
});

gulp.task('styles:css', function() {
  return gulp.src(paths.src.css)
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('tmp/css'));
});

gulp.task('styles:concat', function() {
  return gulp.src('tmp/css/**/*.css')
    .pipe(concat('styles.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function(callback) {
  sequence(['styles:scss', 'styles:css'], 'styles:concat', callback);
});

// scripts

gulp.task('scripts', function() {
  return gulp.src('app/js/main.js')
    .pipe(browserify({
      transform: ['coffeeify', 'hbsfy'],
      extensions: ['.coffee'],
      shim: files || {}
    }))
    .pipe(uglify())
    .pipe(rename('scripts.js'))
    .pipe(gulp.dest('dist'));
});

// versioning

gulp.task('bump:major', function() {
  gulp.src(['package.json', './bower.json'])
    .pipe(bump({ type: 'major' }))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function() {
  gulp.src(['package.json', './bower.json'])
    .pipe(bump({ type: 'minor' }))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:patch', function() {
  gulp.src(['package.json', './bower.json'])
    .pipe(bump({ type: 'patch' }))
    .pipe(gulp.dest('./'));
});

// templates

gulp.task('templates', function() {
  return gulp.task('templates', function() {
    gulp.src(['app/pages/*.hbs'])
      .pipe(handlebars({
        pkg: pkg,
        path: paths.dest
      }))
      .pipe(extreplace('.html'))
      .pipe(gulp.dest('dist'));
  });
});

// cleaning

gulp.task('clean', function() {
  return gulp.src(['dist', 'tmp'])
    .pipe(clean());
});

gulp.task('clean:tmp', function() {
  return gulp.src('tmp')
    .pipe(clean());
});

// server

gulp.task('server', function() {
  var app = express();
  app.use(express.static('dist'));
  app.listen(4000);
});

// build

gulp.task('build', function(callback) {
  sequence('clean', ['scripts', 'styles'], 'templates', 'clean:tmp', callback);
});

gulp.task('default', ['build']);

// watch

gulp.task('watch', function() {
  gulp.src(['app/**/*.hbs', 'app/**/*.html', 'app/**/*.js', 'app/**/*.coffee', 'app/**/*.scss', 'app/**/*.css'])
    .pipe(watch(function() {
      sequence('build');
    }));
});
