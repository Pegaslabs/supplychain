import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import StatusTemplate from './../templates/status.hbs';
import StatusLoadTemplate from './../templates/status-load.hbs';
import StatusCompleteTemplate from './../templates/status-complete.hbs';
import SyncService from './../services/sync-service'
import TransactionsView from './transactions-view'

export default Backbone.View.extend({

  template: StatusTemplate,
  completeTemplate: StatusCompleteTemplate,
  loadingTemplate: StatusLoadTemplate,
  pctLoaded: 0,
  initialize: function(){
    Backbone.on('upToDate',this.upToDate,this);
    Backbone.on('syncingStarted',this.loading,this);
    Backbone.on('syncingComplete',this.upToDate,this);
    Backbone.on('savedTransactions',this.loading,this);
    this.syncService = new SyncService();
    // this.syncService.start();
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
