import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import ShipmentsTemplate from './../templates/shipments.hbs';

export default Backbone.View.extend({

  template: ShipmentsTemplate,
  shipments: [],
  events:{
    'click .dropdown-toggle': 'toggleTransactions',
  },
  toggleTransactions: function(e){
    console.log(e);
  },
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
