import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DB from './../services/db';

export default Backbone.Collection.extend({
  initialize: function(){
    this.db = new DB();
  },
  save: function(){
    return this.db.bulkDocs(this.toJSON());
  },
  // server transaction:
  // ["2013-07-01", "Central Warehouse", "Initial Warehouse Count", "S", "Central Warehouse", "I", "Alcophyllex 200ml", "SYRUPS, MIXTURE, SUSPENSIONS ETC", "2014-07-01", null, 6.35, 64, "system", "2014-02-04", 406.4, 1, 1, 1, 3]
  convertFromTransactions: function(transactions){
    var ourShipments = _.reduce(transactions,function(result,transaction){
      // shipment id is at pos. 16
      result[transaction[16]] = result[transaction[16]] || [];
      result[transaction[16]].push(transaction);
      return result;
    },{});
    return true;
  }
});