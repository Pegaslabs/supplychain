define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'hb-helpers'
], function($, _, Backbone, Router,HBHelpers){
  var initialize = function(){
    HBHelpers.initialize();
    Router.initialize();
  }
  return {
    initialize: initialize
  };
});