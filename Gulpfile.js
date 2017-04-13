/*
Required Dependencies
*/
var gulp 			= require('gulp'),
	gutil 			= require('gulp-util'),
	plumber 		= require('gulp-plumber'),

	bower 			= require('main-bower-files'),
	bowerNormalizer = require('gulp-bower-normalize'),

	babel 		= require('gulp-babel'),
	babelCore 	= require('babel-core'),
	babelPoly 	= require('babel-polyfill'),
	concat 		= require('gulp-concat'),
	sourcemaps 	= require('gulp-sourcemaps'),

	jshint 		= require('gulp-jshint'),
	closure 	= require('gulp-closure-compiler'),

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
	dist: "../"
}

var settings = {
	"javascript":{
		prod: basePaths.prod + 'scripts/',
		dist: basePaths.dist + 'js/',
		compiler: ''

	},
	"css":{
		prod: basePaths.prod + 'styles/',
		dist: basePaths.dist + ''
	},
	"html":{
		prod: basePaths.prod,
		dist: basePaths.dist
	},
	"images":{
		prod: basePaths.prod + 'assets/',
		dist: basePaths.dist + 'img/'
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
	gutil.log( gutil.colors.bold.bgBlue('Compiling Javascript')) ;
	gutil.log( gutil.colors.cyan('\t[' + settings["javascript"].prod + '] => [' + settings["javascript"].dist + ']') );
	gutil.log( gutil.colors.cyan('\tRunning through JSHint...') );
	gutil.log( gutil.colors.cyan('\tRunning through Babel...') );
	gutil.log('\n');

	return gulp.src( settings["javascript"].prod + '*.js')
		.pipe( plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}) )
		.pipe(sourcemaps.init())
		.pipe( jshint() )
		.pipe( babel({
            presets: ['env']
		}) )
		.pipe( concat('app.js') )
		.pipe( sourcemaps.write('.') )
		.pipe( plumber.stop() )
		.pipe( gulp.dest( settings["javascript"].dist ));
});

gulp.task('compress-js', function(){
	gutil.log( gutil.colors.blue('Compressing JS ['+ settings["javascript"].dist +'app.js] with Closure Compiler...') );
	gutil.log('\n');

	return gulp.src( settings["javascript"].dist +'**/*.js')
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>")} ))
		.pipe(closureCompiler({
			compilerPath:  settings["javascript"].compiler,
			fileName: 'scripts.min.js'
		}))
		.pipe( plumber.stop() )
		.pipe( gulp.dest( settings["javascript"].dist ));
});

gulp.task('js-concat', function() {
	gutil.log( gutil.colors.bold.bgBlue('\nNew Plugin Found:') );
	gutil.log( gutil.colors.cyan('\tCombining it to [' + settings["javascript"].dist + 'plugins]' + ' file...') );
	gutil.log('\n');

	return gulp.src( settings["javascript"].prod+'plugins/*.js' )
		.pipe( concat('plugins.js'))
		.pipe( gulp.dest( settings["javascript"].dist + 'plugins' ));
});

/* ------------------------------
CSS
------------------------------*/
gulp.task('sass', function() {
	gutil.log( gutil.colors.bold.bgGreen('Compiling SCSS to CSS...') );
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
	gutil.log( gutil.colors.bgGreen('\nAppending browsers prefixes [\'last 2 versions\', \'> 5%\', \'Explorer > 10\'] to CSS...\n') );
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