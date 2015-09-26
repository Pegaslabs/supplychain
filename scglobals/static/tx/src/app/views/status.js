import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import StatusTemplate from './../templates/status-tpls.hbs';
import SyncService from './../services/sync-service'
import TransactionsView from './transactions-view'

export default Backbone.View.extend({

  template: StatusTemplate,
  el: '#content',
  pctLoaded: 0,
  initialize: function(){
    Backbone.on('foundNewTransactions',this.renderNewTransactions,this);
    Backbone.on('savedTransactions',this.renderNewTransactions,this);
    let syncService = new SyncService();
    syncService.start();
  },
  renderNewTransactions: function(newTransactionsCount,offset,latestTransactions){
    if (offset) this.pctLoaded = ((offset / newTransactionsCount) * 100);
    this.$el.empty().append(this.template({
      newTransactions: newTransactionsCount,
      offset: offset, 
      pct: this.pctLoaded
    })).append(new TransactionsView().render(latestTransactions));
  },
  render: function() {
    this.$el.empty().append(this.template());
  },
});
