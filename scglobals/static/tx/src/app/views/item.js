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
      this.$el.html(this.template(transactions.rows));
    });
  },
});
