import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import LocalDB from './../services/localdb'
import MainTemplate from './../templates/main-tpls.hbs';
import StatusView from './status';

export default Backbone.View.extend({
  template: MainTemplate,
  el: '#main',
  initialize: function(){
    this.localDB = new LocalDB("txdb");
    Backbone.on('showLoad', this.showLoad,this);
    this.statusView = new StatusView();
  },
  render: function() {
    this.$el.empty()
      .append(this.template());
    this.statusView.render().then((renderedContent)=>{
      this.$el.append(renderedContent);
    });
  },
  events:{
    'click #admin': 'showAdmin',
    'click #destroyDB': 'destroyDB',
    'click #toggleNav': 'toggleNav',
    'click #server-status': 'toggleServerStatus'
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
  toggleServerStatus: function(e){
    e.preventDefault();
    $('#status').fadeToggle('fast');
  },
  destroyDB: function(e){
    e.preventDefault();
    $('#destroyDB').toggleClass('hide');
    Backbone.trigger('showLoad',
      "Clearing local data...",
      "Local data cleared.",
      this.localDB.destroy_db());
  }
});
