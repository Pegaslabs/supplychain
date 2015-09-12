require.config({
  paths: {
    lodash: '../bower_components/lodash/lodash',
    jquery: '../bower_components/jquery/dist/jquery',
    handlebars: '../bower_components/handlebars/handlebars',
    text: '../bower_components/requirejs-text/text'
  }
});

require([
  'lodash',
  'jquery',
  'handlebars',
  'text!../templates/stockchanges.html'
], function(_,$,Handlebars,scTemplate){
  Handlebars.registerHelper('expirationDate', function(val) {
    var date = new Date(val);
    if (!_.isDate(date)) {
      return " ";
    }
    else{
      return date.getMonth() + '/' + date.getFullYear();      
    }
  });
  Handlebars.registerHelper('showDate', function(val) {
    var date = new Date(val);
    if (!_.isDate(date)) return null;
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
  });
  $.get('/stockchanges.json').success(function(data){
    data = _.map(data,function(row){
      return _.map(row,function(field){
        return (field) ? field : " ";
      });
    });
    var template = Handlebars.compile(scTemplate);
    $('#app').html(template({transactions: data}));
  });
});