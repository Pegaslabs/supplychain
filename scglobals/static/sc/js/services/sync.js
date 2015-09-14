define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
		var self = this;
	  $.get('/stockchanges.json?startdate=2015-09-10&enddate=2015-09-11&limit=100').success(function(data){
	    data = _.map(data,function(row){
	      return _.map(row,function(field){
	        return (field) ? field : " ";
	      });
	    });
	    // var template = Handlebars.compile(scTemplate);
	    // self.$el.html(template({transactions: data}));
	 });
  return {};
});