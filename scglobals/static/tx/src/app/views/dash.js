import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import DashTemplate from './../templates/dash.hbs';
import tsTemplate from './../templates/transactions-summary.hbs';
import ShipmentsView from './shipments-view'
import LocalDB from './../services/localdb'

export default Backbone.View.extend({

  template: DashTemplate,
  el: '#content',
  initialize: function(){
    this.localDB = new LocalDB();
  },
  render: function() {
    this.$el.html(this.template());
    this.localDB.query('scbydate').then((result)=>{
      $('#transactionsdiv').html(new ShipmentsView().render(result));
    });
    // Promise.all([
    //   this.localDB.query('scbydate',{reduce: true}),
    //   this.localDB.query('scbyvalue',{reduce: true})
    //   ]).then((result)=>{
    //     $("#transactions-summary").html(
    //       tsTemplate({total_transactions: result[0][0], total_value: result[1][0]})
    //     );
    //   },(err)=>{
    //     console.log(err);
    //   });
  },
});
