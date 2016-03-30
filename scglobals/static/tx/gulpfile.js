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

gulp.task('clean', function(cb) {
  del([dist], cb);
});

// by default build project and then watch files in order to trigger livereload
gulp.task('default', ['build', 'serve', 'watch']);

// waits until clean is finished then builds the project
gulp.task('build', ['clean'], function(){
  gulp.start(['static', 'html','scripts','styles']);
});

// couchdb deploy

var move_files = function(){
  var tablesjs_filename = 'tables-' + releaseNo + '.js';
  var vendorjs_filename = 'vendor-' + releaseNo + '.js';
  var tablescss_filename = 'tables-' + releaseNo + '.css';
  var vendorcss_filename = 'vendor-' + releaseNo + '.css';
  // get rev if doc exists
  request(url + "tables/_design/tables", function(err, response, body) {
    var rev = null;
    var b = JSON.parse(body)
    if (!b.error) rev = b._rev;
    var htmlfile = new Buffer(fs.readFileSync('./couchdbbound/index.html','utf8')
      .replace(/assets\//g, '')
      .replace(/tables.js/g, tablesjs_filename)
      .replace(/vendor.js/g, vendorjs_filename)
      .replace(/tables.css/g, tablescss_filename)
      .replace(/vendor.css/g, vendorcss_filename))
      .toString('base64');
    var vendorcss = new Buffer(fs.readFileSync('./couchdbbound/assets/vendor.css','utf8')
      .replace(/..\/fonts\//g, '')).toString('base64');
    var tablescss = new Buffer(fs.readFileSync('./couchdbbound/assets/tables.css','utf8')
      .replace(/..\/fonts\//g, '')).toString('base64');
    var vendorjs = fs.readFileSync('./couchdbbound/assets/vendor.js').toString('base64');
    var tablesjs = fs.readFileSync('./couchdbbound/assets/tables.js').toString('base64');
    var font = fs.readFileSync('./couchdbbound/fonts/fontawesome-webfont.woff2').toString('base64');
    var data = {
      "_attachments": {
        "index.html": {"content_type" : "text\/html","data" : htmlfile}
      }
    };
    data['_attachments'][tablesjs_filename] = {"content_type":"application\/javascript", "data":  tablesjs};
    data['_attachments'][vendorjs_filename] = {"content_type":"application\/javascript", "data":  vendorjs};
    data['_attachments'][tablescss_filename] = { "content_type" : "text\/css", "data" : tablescss};
    data['_attachments'][vendorcss_filename] = { "content_type" : "text\/css", "data" : vendorcss};
    data['_attachments']["fontawesome-webfont.woff2"] = { "content_type" : "application\/octet-stream", "data" : font};

    if (rev) data['_rev'] = rev;
    data = JSON.stringify(data);
    request({
      uri: url + "tables/_design/tables",
      method: "PUT",
      form : data
    }, function(err, response, body) {
      console.log(body);
      // mfCallback();
    });
  });
};

gulp.task('deploy',function(){
  // login
  return request({
    uri: url + "_session",
    method: "POST",
    form: {
      name: username,
      password: password
    }
  }, function(err, response, body) {
    if(err) throw err;
    if (!JSON.parse(body)["ok"]){
      throw "Error!!" + body.toString();
    }
    // get design doc rev
    request(url + "tables/_design/tables",function(err,response,body){
      debugger;
      if (err) throw err;
        var b = JSON.parse(body);
      if (b && b.reason && b.reason === "no_db_file"){
        createdb(function(resp){
          move_files();
        });
      }
      else{
        move_files();
      }
    });
  });
});
