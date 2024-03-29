var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();
var del = require('del');
var fs = require('fs');
var runSequence = require('run-sequence');

var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';
var webpackConfig = require('./webpack.config.js')[environment];

var request = require("request").defaults({jar: true});

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
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

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
    // .pipe($.cleanCss())
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

// gulp.task('static', function(cb) {
//   return gulp.src(src + 'static/**/*')
//     .pipe($.size({ title : 'static' }))
//     .pipe(gulp.dest(dist + '/'));
// });

gulp.task('watch', function() {
  gulp.watch(src + 'less/*.less', ['styles']);
  gulp.watch(src + 'index.html', ['html']);
  gulp.watch(src + 'app/**/*.js', ['scripts']);
  gulp.watch(src + 'app/**/*.hbs', ['scripts']);
  gulp.watch(src + 'app/**/*.handlebars', ['scripts']);
});

gulp.task('clean', function() {
  return del([dist]);
});

// by default build project and then watch files in order to trigger livereload
gulp.task('default', function(){
  return runSequence('build', ['serve', 'watch']);
});

// waits until clean is finished then builds the project
gulp.task('build',function(){
  return runSequence('clean',['html','scripts','styles']);
});

// couchdb deploy
// TODO move to separate gulp file

var dbname = "tables_sc_app";

try{
    var credentials = JSON.parse(fs.readFileSync('couchdb_credentials.json', 'utf8'));
    var url = credentials.url;
    var username = credentials.username;
    var password = credentials.password;
} catch(e){
  throw "credentials file missing, see readme";
}

var createdb = function(callback){
  request({
    uri: url + dbname,
    method: "PUT",
  }, function(err, response, body) {
      if(err) throw err;
      if (!JSON.parse(body)["ok"]) throw "Error!!" + body.toString();
      callback();
    }
  );
};

var move_files = function(){
  // get rev if doc exists
  request(url +  dbname + "/_design/tables", function(err, response, body) {
    var b = JSON.parse(body);
    if (b._rev){
        var rev = b._rev.split("-")[0];
    } else{
      var rev = 0;
    }
    var tablesjs_filename = 'tables-' + rev + '.js';
    var tablescss_filename = 'tables-' + rev + '.css';
    var htmlfile = new Buffer(fs.readFileSync('./dist/index.html','utf8')
      .replace(/js\/main.js/g, tablesjs_filename)
      .replace(/css\/main.css/g, tablescss_filename))
      .toString('base64');
    var tablescss = fs.readFileSync('./dist/css/main.css').toString('base64');
      // .replace(/..\/fonts\//g, '')).toString('base64');
    var tablesjs = fs.readFileSync('./dist/js/main.js').toString('base64');
    var data = {
      "_attachments": {
        "index.html": {"content_type" : "text\/html","data" : htmlfile}
      }
    };
    data['_attachments'][tablesjs_filename] = {"content_type":"application\/javascript", "data":  tablesjs};
    data['_attachments'][tablescss_filename] = { "content_type" : "text\/css", "data" : tablescss};

    if (rev) data['_rev'] = b._rev || null;
    data = JSON.stringify(data);
    request({
      uri: url +  dbname + "/_design/tables",
      method: "PUT",
      form : data
    }, function(err, response, body) {
      if (err) throw err;
      console.log(body);
      // mfCallback();
    });
  });
};

gulp.task('postDocs',function(){
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
    request(url + dbname + "/_design/tables",function(err,response,body){
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

// todo: actually make synchronous
gulp.task('deploy', ['build'], function(){
  setTimeout(function(){gulp.start(['postDocs'])},10000);
});
