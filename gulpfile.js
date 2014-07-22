var gulp = require('gulp');

var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var ejs = require('gulp-ejs');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var fs = require('fs');
var glob = require('glob');
var openBrowser = require('open');
var sequence = require('run-sequence');
var app = require('./gulp/server');

var pkg = require('./package.json');
var paths = require('./config/paths.json');
var shim = require('./config/shim.json');

// images

gulp.task('images', function() {
  return gulp.src(paths.src.img)
    .pipe(gulp.dest('dist/img'));
});

// styles

gulp.task('styles:scss', function() {
  return gulp.src(paths.src.sass)
    .pipe(sass())
    .pipe(concat('styles.sass.css'))
    .pipe(gulp.dest('tmp/css'));
});

gulp.task('styles:css', function() {
  return gulp.src(paths.src.css)
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('tmp/css'));
});

gulp.task('styles:concat', function() {
  return gulp.src('./tmp/css/**/*.css')
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('styles:page:css', function() {
  return gulp.src(paths.src['_css'])
    .pipe(gulp.dest('dist/css'));
});

gulp.task('styles', function(callback) {
  sequence(['styles:scss', 'styles:css'], 'styles:concat', 'styles:page:css', callback);
});

// scripts

gulp.task('scripts:shim', function() {
	
	gulp.src('gulp/noop.js', { read: false })
		.pipe(browserify({
      debug: false,  // Don't provide source maps for vendor libs
    }))
		.on('prebundle', function(bundle) {
			for (var name in shim) {
				bundle.require('../' + shim[name], { expose: name });
			}
    })
		.pipe(rename('vendor.js'))
    .pipe(gulp.dest('dist/js'));
	
});

gulp.task('scripts:page', function() {
	
	glob(paths.src['_js'], function (er, files) {
		files.forEach(function(file) {
			var names = file.split('/');
			var filename = names[names.length-1];
			gulp.src(file, { read: false })
				.pipe(browserify({
		      debug: false,  // Don't provide source maps for vendor libs,
					extensions: ['.hbs'],
					transform: ['hbsfy']
		    }))
				.on('prebundle', function(bundle) {
					for (var name in shim) {
						bundle.external(name);
					}
		    })
				.pipe(rename(filename))
		    .pipe(gulp.dest('dist/js'));
		});
	});
	
});

gulp.task('scripts', function(callback) {
  sequence('scripts:shim', 'scripts:page', callback);
});

// template pre-processing

gulp.task('templates', function() {
	
});

// pages

gulp.task('pages', function() {
	var partials = {};
	glob(paths.src['_pages'], function (er, files) {
		files.forEach(function(file) {
			var names = file.split('/');
			partials[names[names.length-1]] = fs.readFileSync(file, 'utf8');
		});
		gulp.src(paths.src.pages)
		  .pipe(ejs({
					load: function(file) {
						return partials[file] || '';
					}
		  }))
		  .pipe(gulp.dest("./dist"));
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

// serving

gulp.task('server', function() {
	app.set('port', 4000);
	app.listen(app.get('port'), function() {
		console.log('Server listening on port %s ...', app.get('port'));
		openBrowser('http://localhost:' + app.get('port'));
	});
});

// building

gulp.task('build', function(callback) {
  sequence('clean', ['styles', 'images', 'pages', 'scripts'], 'clean:tmp', callback);
});

// default

gulp.task('default', ['build']);
