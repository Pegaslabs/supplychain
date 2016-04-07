import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import TransactionsTemplate from './../templates/transactions-table.hbs';
import QueryView from './query-view';
import DefaultQueryModel from './../models/default-query';
import ExpirationsTemplate from './../templates/expirations.hbs';

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
  },
  renderDetails: function(){
    QueryView.prototype.renderDetails.apply(this, arguments);
    this.reduce_model = new DefaultQueryModel(this.model.toJSON());
    this.reduce_model.set('reduce',true);
    this.reduce_model.set('group',true);
    this.reduce_model.set('query','inventory');
    console.log(this.reduce_model.toJSON());
    this.reduce_model.fetch().then(()=>{
      this.reduce_model.set('showResults',_.filter(this.reduce_model.get('results').rows,function(row){return (row.value.sum !== 0)}));
      this.$el.find('.details').prepend(ExpirationsTemplate(this.reduce_model.get('showResults')));
    });
  }
});
