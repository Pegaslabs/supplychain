var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();
var del = require('del');

var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';
var webpackConfig = require('./webpack.config.js')[environment];

var port = $.util.env.port || 8080;
var src = 'src/';
var dist = 'dist/';

var autoprefixerBrowsers = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('scripts', function() {
  return gulp.src(webpackConfig.entry)
    .pipe($.webpack(webpackConfig))
    .pipe(isProduction ? $.uglifyjs() : $.util.noop())
    .pipe(gulp.dest(dist + 'js/'))
    .pipe($.size({ title : 'js' }))
    .pipe($.connect.reload());
});

gulp.task('html', function() {
  return gulp.src(src + 'index.html')
    .pipe(gulp.dest(dist))
    .pipe($.size({ title : 'html' }))
    .pipe($.connect.reload());
});

gulp.task('styles', function () {
  return gulp.src(src + 'less/**/*.less')
    .pipe($.less())
    .pipe($.concat('main.css'))
    .pipe(gulp.dest(dist + 'css'))
    .pipe($.size({ title : 'styles' }))
    .pipe($.connect.reload());
});

gulp.task('serve', function() {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35728
    }
  });
});

gulp.task('static', function(cb) {
  return gulp.src(src + 'static/**/*')
    .pipe($.size({ title : 'static' }))
    .pipe(gulp.dest(dist + '/'));
});

gulp.task('watch', function() {
  gulp.watch(src + 'less/*.less', ['styles']);
  gulp.watch(src + 'index.html', ['html']);
  gulp.watch(src + 'app/**/*.js', ['scripts']);
  gulp.watch(src + 'app/**/*.hbs', ['scripts']);
  gulp.watch(src + 'app/**/*.handlebars', ['scripts']);
});

// var exec = require('child_process').exec;
 
// gulp.task('rundjango', function () {
//   console.log(exec('ping localhost'));
//   exec('cd ../../../ && python manage.py runserver', function (err, stdout, stderr) {
//     console.log(stdout);
//     console.log(stderr);
//     cb(err);
//   });
// })


gulp.task('clean', function(cb) {
  del([dist], cb);
});

// by default build project and then watch files in order to trigger livereload
gulp.task('default', ['build', 'serve', 'watch']);

// waits until clean is finished then builds the project
gulp.task('build', ['clean'], function(){
  gulp.start(['static', 'html','scripts','styles']);
});
