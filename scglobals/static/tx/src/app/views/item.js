import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import TransactionsTemplate from './../templates/transactions-table.hbs';
import QueryView from './query-view';
import DefaultQueryModel from './../models/default-query';

export default QueryView.extend({
  initialize: function(userSettings,category,itemName,options){
    var options = options || {};
    options.startkey = [userSettings.get('location'),itemName,category,{}];
    options.endkey = [userSettings.get('location'),itemName,category];
    options.query = 'all-transactions';
    options.include_docs = false;
    options.title = itemName;
    options.secondary_title = category;
    this.model = new DefaultQueryModel(options);
    this.render();
  },
  renderTable: function(){
    this.$el.find('.results-table').html(TransactionsTemplate(this.model.get('results').rows));
  }
});
