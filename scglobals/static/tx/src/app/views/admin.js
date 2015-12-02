import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import db from './../services/db'
import AdminTemplate from './../templates/admin.hbs';

export default Backbone.View.extend({
  template: AdminTemplate,
  pctLoaded: 0,
  initialize: function(){
    this.db = new db();
  },
  render: function() {
    return this.$el.html(this.template());
  },
  events:{
    'click #destroyDB': 'destroyDB'
  },
  destroyDB: function(e){
    e.preventDefault();
    $('#adminDropDown').hide();
    $('#destroyDB').toggleClass('hide');
    // this.loadingView.showOverlay("Clearing local data.");
    console.log('destroying db');
    this.db.destroy_db().then((response) => {
      // this.loadingView.hide("Clearing complete!");
      console.log('destroy complete');
    }).catch(function (err) {
      console.log(err);
    });      
    // hack to reload page with no data
    // window.location.reload()
  }
  initialize: function(){
    Backbone.on('migrationStarted',this.loading,this);
    Backbone.on('migrationComplete',this.upToDate,this);
    this.migrationService = new MigrationService();
  },
  loading: function(newTransactionsCount,offset,latestTransactions){
    $("#status-starting").hide();
    if (offset) this.pctLoaded = ((offset / newTransactionsCount) * 100);
    $("#load-status").html(this.loadingTemplate({
      newTransactions: newTransactionsCount,
      offset: offset,
      pct: this.pctLoaded
    }));
  },
  upToDate: function(totalTransactions){
    $("#status-starting").hide();
    $("#load-status").html(this.completeTemplate({
      totalTransactions: totalTransactions,
    }));
  },
  offline: function(){
    console.log('TODO. WE OFFLINE.')
  },
  render: function() {
    return this.$el.html(this.template({starting: true,checkedDate: new Date()}));
  }
});
