import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import LocalDB from './../services/localdb'
import MainTemplate from './../templates/header-tpls.hbs';
import StatusView from './status';
import LoadingView from './loading';

export default Backbone.View.extend({
  template: MainTemplate,
  el: '#app',
  initialize: function(){
    this.localDB = new LocalDB("txdb");
    this.statusView = new StatusView();
    this.loadingView = new LoadingView();
    Backbone.on('showLoad', this.loadingView.showLoad,this.loadingView);
  },
  render: function() {
    this.$el.empty()
      .append(this.template())
      .append(this.loadingView.render());
    this.statusView.render().then((renderedContent)=>{
      this.$el.append(renderedContent);
    });
  },
  events:{
    'click #admin': 'showAdmin',
    'click #destroyDB': 'destroyDB',
    'click #toggleNav': 'toggleNav',
    'mouseenter #server-status': 'showServerStatus',
    'mouseleave #server-status': 'hideServerStatus'
  },
  toggleNav: function(){
    e.preventDefault();
    $('#collapsedNav').toggle();
  },
  showAdmin: function(e){
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
    $('#destroyDB').toggleClass('hide');
    Backbone.trigger('showLoad',
      "Clearing local data...",
      "Local data cleared.",
      this.localDB.destroy_db());
    // hack to reload page with no data
    window.location.reload()
  }
});
