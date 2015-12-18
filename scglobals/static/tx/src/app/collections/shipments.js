import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DB from './../services/db';
import ShipmentModel from './../models/shipment';

export default Backbone.Collection.extend({
  model: ShipmentModel,
  initialize: function(){
    this.db = new DB();
  },
  save: function(){
    return this.db.bulkDocs(this.toJSON());
  },
  fetch: function(){
    return this.db.query('shipments-by-date');
  }
  // Promise.all([
  //   this.db.query('scbydate',{reduce: true}),
  //   this.db.query('scbyvalue',{reduce: true})
  //   ]).then((result)=>{
  //     $("#transactions-summary").html(
  //       tsTemplate({total_transactions: result[0][0], total_value: result[1][0]})
  //     );
  //   },(err)=>{
  //     console.log(err);
  //   });
});