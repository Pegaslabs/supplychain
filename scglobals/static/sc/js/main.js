require.config({
  paths: {
    underscore: '../bower_components/underscore/underscore',
    jquery: '../bower_components/jquery/dist/jquery',
    handlebars: '../bower_components/handlebars/handlebars',
    text: '../bower_components/text/text',
    backbone: '../bower_components/backbone/backbone',
  }
});

require([
  'app',
], function(App){
  App.initialize();
});