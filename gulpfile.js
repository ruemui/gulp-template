var gulp = require('gulp');
var fs = require('fs');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var pngquant = require('imagemin-pngquant');
var mozjpeg = require('imagemin-mozjpeg');
var guetzli = require('imagemin-guetzli');
var browserSync = require('browser-sync').create();
var path = require('path');
var PATH_SRC = 'src'
var PATH_DIST = 'dist'

/*
 * copy
 */
gulp.task('copy', function(){
	return gulp.src([
		PATH_SRC + '/**/*.{html,php,pdf,mp4,woff,ttf,otf,svg,css}'
	])
	.pipe(gulp.dest(PATH_DIST));
});

/*
 * sass
 */
gulp.task('build:sass', function(){
	return gulp.src(PATH_SRC + '/asset/css/**/*.scss')
		.pipe($.plumber({
			errorHandler: $.notify.onError("Error: <%= error.message %>")
		}))
		.pipe($.sass({
			indentType: 'tab',
			indentWidth: 1,
			outputStyle: 'expanded'
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({
			browsers: [
				'last 2 versions',
				'iOS >= 8',
				'Android >= 4.4'
			],
			cascade: false
		}))
		.pipe(gulp.dest(PATH_DIST + '/asset/css'))
		.pipe(browserSync.stream());
});

/*
 * imagemin
 */
gulp.task('build:image', function(){
	return gulp.src(PATH_SRC + '/**/*.{png,jpg}')
		.pipe($.changed(PATH_DIST)) // 更新したファイルのみを対象に
		.pipe($.imagemin([
			pngquant({
				quality: 90,
				speed: 3,
				verbose: false
			}),
			mozjpeg({
				quality: 100
			})
		], {
			verbose: true // 詳細を出力
		}))
		.pipe(gulp.dest(PATH_DIST));
});

/*
 * ejs
 */
gulp.task('build:ejs', function() {
	var json = JSON.parse(fs.readFileSync(PATH_SRC + '/sitedata.json'));
	return gulp.src([PATH_SRC + '/**/*.ejs', '!' + PATH_SRC + '/**/_*.ejs'])
		.pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
		.pipe($.ejs(json, {}, {ext: '.html'}))
		.pipe(gulp.dest(PATH_DIST));
})

/*
 * pug
 */
gulp.task('build:pug', function() {
	//var json = JSON.parse(fs.readFileSync(PATH_SRC + '/sitedata.json'));
	var locals = {
		'sitedata' : JSON.parse(fs.readFileSync(PATH_SRC + '/sitedata.json'))
	};
	return gulp.src([PATH_SRC + '/**/*.pug', '!' + PATH_SRC + '/**/_*.pug'])
		.pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
		.pipe($.data(function(file){
			locals.relativePath = path.relative(file.base, file.path.replace(/.pug$/, '.html'));
			return locals;
		}))
		.pipe($.pug({
			locals: locals,
			basedir: PATH_SRC,
			pretty: true
		}))
		.pipe(gulp.dest(PATH_DIST))
		.pipe(browserSync.stream());
});

/*
 * local server
 */
gulp.task('build:server', function(){
	browserSync.init({
		server: {
			baseDir: PATH_DIST
		}
	});
});

gulp.task('default',['build', 'watch']);

gulp.task('build', function(){
	//runSequence('copy', 'build:ejs', 'build:sass', 'build:image', 'build:server');
	runSequence('copy', 'build:pug', 'build:sass', 'build:image', 'build:server');
});

gulp.task('watch', function(){
	gulp.watch([PATH_SRC + '/**/*.{html,php,pdf,mp4,woff,ttf,otf,svg,css}'], ['copy']).on('change', browserSync.reload);
	//gulp.watch([PATH_SRC + '/**/*.ejs'], ['build:ejs']).on('change', browserSync.reload);
	gulp.watch([PATH_SRC + '/**/*.pug'], ['build:pug']).on('change', browserSync.reload);
	gulp.watch([PATH_SRC + '/asset/css/**/*.scss'], ['build:sass']);
	gulp.watch([PATH_SRC + '/**/*.{png,jpg}'], ['build:image']);
});
