import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import ItemTemplate from './../templates/item.hbs';
import TransactionsTemplate from './../templates/transactions-table.hbs';
import ItemQueryModel from './../models/item-query.js';

export default Backbone.View.extend({
  template: ItemTemplate,
  initialize: function(userSettings,category,itemName){
    this.model = new ItemQueryModel({location: userSettings.get('location'),name: itemName,category: category});
    this.render();
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.model.fetch().then((transactions)=>{
      // we have two emits for each transaction to get from & two location
      // emits send 0 if it's the from location, and 1 if it's the to location
      transactions.rows.forEach(function(transaction,i,transactions){
        if (!transaction.key[6]){
          transaction.value = transaction.value * -1;
        }
      });
      this.$el.find('.transactions').html(TransactionsTemplate(transactions.rows));
    });
  },
});
