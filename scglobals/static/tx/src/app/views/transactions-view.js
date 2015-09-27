import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import StockChangesTemplate from './../templates/transactions-tpls.hbs';

export default Backbone.View.extend({

  template: StockChangesTemplate,
  shipments: [],
  render: function(transactions) {
    this.shipments = _.reduce(transactions,function(result,transaction){
      if (!result[transaction.shipment_id]) result[transaction.shipment_id] = [];
      result[transaction.shipment_id].push(transaction);
      return result;
    },{});
    console.log(this.shipments);
    return this.template({shipments: this.shipments});
  },
});
