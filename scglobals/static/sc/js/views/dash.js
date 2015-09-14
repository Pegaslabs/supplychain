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
      console.log('oh yeha!');
    }
  });
  return DashView;
});