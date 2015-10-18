import $ from 'jquery';
import Backbone from 'backbone';

import LoadingTemplate from './../templates/loading.hbs';

export default Backbone.View.extend({
  template: LoadingTemplate,
  render: function() { 
    var rendered = this.$el.html(this.template());
    rendered.find("#loading").hide();
    return rendered;
  },
  showOverlay: function(){
    $("#loading").addClass('overlay-box');
    this.show();
  },
  show: function(loadingText){
    $('#loading-text').text(loadingText || "");
    $('#loading').show();
    $("#loading-spinner").show();
    $('#loading-check').hide();
  },
  hide: function(finishedText){
    $('#loading-text').text(finishedText || "");
    $("#loading-spinner").hide();
    $('#loading-check').show();
    if (finishedText) $("#loading").delay(200).fadeOut();
    else $("#loading").fadeOut();
  }
});
