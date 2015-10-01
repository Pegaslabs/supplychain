import $ from 'jquery';
import Backbone from 'backbone';

import LoadingTemplate from './../templates/loading-tpls.hbs';

export default Backbone.View.extend({
  template: LoadingTemplate,
  render: function() {
    return this.template();
  },
  showLoad: function(loadingText,finishedText,onceFinishedPromise){
    $('#loading-text').text(loadingText);
    $('#loading').show();
    $("#loading-spinner").show();
    $('#loading-check').hide();
    if (onceFinishedPromise){
      onceFinishedPromise.then(()=>{
        $('#loading-text').text(finishedText);
        $("#loading-spinner").hide();
        $('#loading-check').show();
        $("#loading").delay(200).fadeOut();
      });
    }
  }
});
