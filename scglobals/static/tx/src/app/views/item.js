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
    this.itemName = itemName;
    this.category = category;
    this.render();
  },
  renderTable: function(obj){
    var itemId, sum = obj.sum;
    _.each(this.model.get('results').rows,function(row,index,list){
      if (index === 0){
        row.resultQty = sum;
      } else{
        row.resultQty = list[index-1].resultQty - list[index-1].value;
      }
    });
    this.$el.find('.results-table').html(TransactionsTemplate(this.model.get('results').rows));
  }
});
