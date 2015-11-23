import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import LocalDB from './../services/localdb'
import MainTemplate from './../templates/header.hbs';
import StatusView from './status';
import LoadingView from './loading';

export default Backbone.View.extend({
  template: MainTemplate,
  // el: '#header',
  initialize: function(){
    this.localDB = new LocalDB();
    this.statusView = new StatusView();
    this.loadingView = new LoadingView();
    Backbone.on('syncingStarted', this.syncActivity);
    Backbone.on('syncingComplete', this.syncActivity);
  },
  render: function() {
    debugger;
    return this.$el.empty()
    .append(this.template())
    .append(this.loadingView.render())
    .append(this.statusView.render());
    $("#sync-syncing").hide();
  },
  events:{
    'click #admin': 'toggleAdmin',
    'click #destroyDB': 'destroyDB',
    'click #toggleNav': 'toggleNav',
    'mouseenter #server-status': 'showServerStatus',
    'mouseleave #server-status': 'hideServerStatus'
  },
  syncActivity: function(){
    $("#sync-syncing").toggle();
    $("#sync-complete").toggle();
  },
  toggleNav: function(e){
    e.preventDefault();
    $('#collapsedNav').toggle();
  },
  toggleAdmin: function(e){
    e.preventDefault();
    $('#adminDropDown').toggle();
  },
  showServerStatus: function(e){
    e.preventDefault();
    $('.status').fadeIn('fast');
  },
  hideServerStatus: function(e){
    e.preventDefault();
    $('.status').fadeOut('fast');
  },
  destroyDB: function(e){
    e.preventDefault();
    $('#adminDropDown').hide();
    $('#destroyDB').toggleClass('hide');
    this.loadingView.showOverlay("Clearing local data.");
    this.localDB.destroy_db().then((response) => {
      this.loadingView.hide("Clearing complete!");
    }).catch(function (err) {
      console.log(err);
    });      
    // hack to reload page with no data
    // window.location.reload()
  }
});
