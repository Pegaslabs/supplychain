import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import LocalDB from './../services/localdb'

import MainTemplate from './../templates/main-tpls.hbs';

export default Backbone.View.extend({
  template: MainTemplate,
  el: '#main',
  initialize: function(){
    this.localDB = new LocalDB("txdb");
    Backbone.on('showLoad', this.showLoad,this);
  },
  events:{
    'click #admin': "showAdmin",
    'click #destroyDB': "destroyDB",
    "click #toggleNav": 'toggleNav'
  },
  showLoad: function(loadingText,finishedText,onceFinishedPromise){
    $('#loading-text').text(loadingText);
    $('#loading').fadeToggle();
    if (onceFinishedPromise){
      onceFinishedPromise.then(()=>{
        $('#completed-text').text(finishedText);
        $('#loading').hide();
        $("#loading-complete").fadeIn( "slow", function() {
          $("#loading-complete").fadeOut("slow");
        });
      });
    }
  },
  toggleNav: function(){
    e.preventDefault();
    $('#collapsedNav').toggle();
  },
  showAdmin: function(e){
    e.preventDefault();
    $('#destroyDB').toggleClass('hide');
  },
  destroyDB: function(e){
    e.preventDefault();
    $('#destroyDB').toggleClass('hide');
    Backbone.trigger('showLoad',
      "Clearing local data...",
      "Local data cleared.",
      this.localDB.destroy_db());
  },
  render: function() {
    this.$el.empty().append(this.template());
  },
});
