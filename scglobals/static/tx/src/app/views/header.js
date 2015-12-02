import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import db from './../services/db'
import MainTemplate from './../templates/header.hbs';
import LoadingView from './loading';

export default Backbone.View.extend({
  template: MainTemplate,
  // el: '#header',
  initialize: function(){
    this.db = new db();
    this.loadingView = new LoadingView();
  },
  render: function() {
    return this.$el.empty()
    .append(this.template())
    .append(this.loadingView.render())
    $("#sync-syncing").hide();
  },
  events:{
    'click #admin': 'toggleAdmin',
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
    this.db.destroy_db().then((response) => {
      this.loadingView.hide("Clearing complete!");
    }).catch(function (err) {
      console.log(err);
    });      
    // hack to reload page with no data
    // window.location.reload()
  }
});
