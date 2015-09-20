import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import StockChangeCollection from './../collections/sc-collection';
import StockChangesTemplate from './../templates/sc-tpls.handlebars';

export default Backbone.View.extend({

  template: StockChangesTemplate,
  initialize: function(){
    this.loading = false;
    this.collection = new StockChangeCollection();
  },
  render: function() {
    console.log(this.template);
    return this.collection.fetch().then((data)=>{
      return this.template({transactions: data});
    });
  },
});
