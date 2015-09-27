import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import StockChangesTemplate from './../templates/transactions-tpls.hbs';

export default Backbone.View.extend({

  template: StockChangesTemplate,
  shipments: [],
  render: function(transactions) {
    this.shipments = _.reduce(transactions,function(result,transaction){
      if (!result[transaction.shipment_id]) result[transaction.shipment_id] = {
        'transactions': [],
        'transaction_count': 0,
        'total_value': 0
      };
      if (transaction.qty > 0){
        result[transaction.shipment_id]['transactions'].push(transaction);
        result[transaction.shipment_id]['transaction_count'] += 1;
        result[transaction.shipment_id]['total_value'] += transaction.total_value;
      }
      return result;
    },{});
    return this.template({shipments: this.shipments});
  },
});
