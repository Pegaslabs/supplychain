define(['handlebars'], function(Handlebars){
  var initialize = function(){
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
  }
  return {
    initialize: initialize
  };
});