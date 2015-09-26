import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import StockChangeCollection from './../collections/sc-collection';
import StockChangesTemplate from './../templates/sc-tpls.hbs';

export default Backbone.View.extend({

  template: StockChangesTemplate,
  initialize: function(){
    this.loading = false;
    this.collection = new StockChangeCollection();
  },
  render: function(options) {
    return this.collection.fetch(options).then((data)=>{
      return this.template({transactions: _.slice(data,0,50)});
    });
  },
});
