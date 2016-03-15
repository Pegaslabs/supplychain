import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import ItemTemplate from './../templates/item.hbs';
import ItemModel from './../models/item.js';

export default Backbone.View.extend({
  template: ItemTemplate,
  initialize: function(name){
    this.model = new ItemModel({name: name});
    this.render();
  },
  render: function() {
    this.model.fetch().then((transactions)=>{
      // we have two emits for each transaction to get from & two location
      // emits send 0 if it's the from location, and 1 if it's the to location
      transactions.rows.forEach(function(transaction,i,transactions){
        if (!transaction.key[5]){
          transaction.value = transaction.value * -1;
        }
      });
      this.$el.html(this.template(transactions.rows));
    });
  },
});
