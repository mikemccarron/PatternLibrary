/*
Required Dependencies
*/
var gulp 			= require('gulp'),
	gutil 			= require('gulp-util'),
	plumber 		= require('gulp-plumber'),

	bower 			= require('main-bower-files'),
	bowerNormalizer = require('gulp-bower-normalize'),

	babel 		= require('gulp-babel'),
	// babelcli 	= require('babel-cli"'),
	concat 		= require('gulp-concat'),
	sourcemaps 	= require('gulp-sourcemaps'),

	// jshint 		= require('gulp-jshint'),
	// closure 	= require('gulp-closure-compiler'),

	sass 		= require('gulp-sass'),
	prefixer 	= require('gulp-autoprefixer'),
	// pngmin 		= require('gulp-pngmin'),
	// pngquant 	= require('imagemin-pngquant'),
	// imagemin 	= require('gulp-imagemin'),
	// svgmin 		= require('gulp-svgmin'),
	// svgstore 	= require('gulp-svgstore'),

	// path 		= require('path'),
	// rename 		= require('gulp-rename'),
	// ftp 		= require('vinyl-ftp'),

	notify 		= require("gulp-notify");

/*
Settings
*/
var basePaths = {
	prod: "",
	dist: ""
}

var settings = {
	"javascript":{
		prod: basePaths.prod + '',
		dist: basePaths.dist,
		compiler: ''

	},
	"css":{
		prod: basePaths.prod + '',
		dist: basePaths.dist + ''
	},
	"html":{
		prod: basePaths.prod,
		dist: basePaths.dist
	},
	"images":{
		prod: basePaths.prod + '',
		dist: basePaths.dist + ''
	},
	"svgs":{
		prod: basePaths.prod + '',
		dist: ''
	}
}

var deployments = {
	"live":{
		host:	 '',
		user:	 '',
		password: '',
	}
}


gulp.task('default', ['watch']);

gulp.task('settings', function(){
	gutil.log( gutil.colors.bgBlue('Settings') );
	gutil.log( settings );
});

gulp.task('watch', function() {

	gutil.log('Starting JS build...');

	// Watching for JS changes.
	gulp.watch( settings["javascript"].prod + 'plugins/*.js', ['js-concat']);
	gulp.watch( settings["javascript"].prod + '**/*.js', ['js']);

	// Rendering CSS
	gulp.watch( settings["css"].prod +'**/*.scss', ['sass', 'prefix-css']);
});

/* ------------------------------
JS
------------------------------*/
gulp.task('js', function() {
	gutil.log( gutil.colors.bgGreen('\nCompiling Javascript')) ;
	gutil.log( gutil.colors.green('\t[' + settings["javascript"].prod + '] => [' + settings["javascript"].dist + ']') );
	gutil.log( gutil.colors.green('\tRunning through JSHint...') );
	gutil.log( gutil.colors.green('\tRunning through Babel...') );
	gutil.log('\n');

	return gulp.src( settings["javascript"].prod + '*.js')
		.pipe( plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}) )
		.pipe( jshint() )
		.pipe( babel() )
		.pipe( plumber.stop() )
		.pipe( gulp.dest( settings["javascript"].dist ));
});

gulp.task('compress-js', function(){
	console.log('Compressing JS ['+ settings["javascript"].dist +'app.js] with Closure Compiler...');
	console.log('\n');

	return gulp.src( settings["javascript"].dist +'**/*.js')
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>")} ))
		.pipe(closure({
			compilerPath:  settings["javascript"].compiler,
			fileName: 'scripts.min.js'
		}))
		.pipe( plumber.stop() )
		.pipe( gulp.dest( settings["javascript"].dist ));
});

gulp.task('js-concat', function() {
	console.log('\nNew Plugin Found:');
	console.log('\tCombining it to [' + settings["javascript"].dist + 'plugins]' + ' file...');
	console.log('\n');

	return gulp.src( settings["javascript"].prod+'plugins/*.js' )
		.pipe( concat('plugins.js'))
		.pipe( gulp.dest( settings["javascript"].dist + 'plugins' ));
});

/* ------------------------------
CSS
------------------------------*/
gulp.task('sass', function() {
	console.log('\nCompiling SCSS to CSS...');
	return gulp.src( settings["css"].prod + '**/*.scss')
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>")} ))
		.pipe( sass({
				sourcemap: true,
				errLogToConsole: true,
				outputStyle: 'compressed',
			})
		)
		.pipe( plumber.stop() )
		.pipe( gulp.dest( settings["css"].dist ));
});

gulp.task('prefix-css', ['sass'], function () {
	console.log('\nAppending browsers prefixes [\'last 2 versions\', \'> 5%\', \'Explorer > 10\'] to CSS...\n');
	return gulp.src( settings["css"].dist + '*.css')
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>")} ))
		.pipe( prefixer({ browsers: ['last 2 versions', '> 5%', 'Explorer > 10'] }))
		.pipe( plumber.stop() )
		.pipe( gulp.dest( settings["css"].dist ) );
});

/* ------------------------------
Deployments
------------------------------*/
gulp.task('deploy', function(){

});