define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'text!../../templates/stockchanges.html'
], function($, _, Backbone,Handlebars,scTemplate){
  var DashView = Backbone.View.extend({
    el: $("#dash"),
    initialize: function(){
      var self = this;
      $.get('/stockchanges.json').success(function(data){
        data = _.map(data,function(row){
          return _.map(row,function(field){
            return (field) ? field : " ";
          });
        });
        var template = Handlebars.compile(scTemplate);
        self.$el.html(template({transactions: data}));
      });
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return DashView;
});