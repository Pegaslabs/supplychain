import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import DashTemplate from './../templates/dash.hbs';
import ShipmentsSummaryTemplate from './../templates/shipments-summary.hbs';
import ShipmentsTemplate from './../templates/shipments.hbs';
import ShipmentsCollection from './../collections/shipments';

export default Backbone.View.extend({

  template: DashTemplate,
  shipmentsTemplate: ShipmentsTemplate,
  el: '#container',
  initialize: function(){
    this.shipmentsCollection = new ShipmentsCollection();
  },
  showShipments: function(){
    $("#loading").hide()
    $("#shipments").removeClass('hidden').hide().fadeIn(1000);
  },
  showSummary: function(){
    $("#loading-summary").fadeOut('fast');
    $("#shipments-summary").removeClass('hidden').hide().fadeIn(1000);
  },
  render: function() {
    this.$el.html(this.template());
    var shipments_promise = this.shipmentsCollection.fetch().then((shipments)=>{
      $("#shipments").html(this.shipmentsTemplate(shipments.doc_rows));
      return shipments.total_rows;
    });
    var shipments_value_promise = this.shipmentsCollection.fetch({reduce: true},'shipments-by-value');
    var shipments_transactions_promise = this.shipmentsCollection.fetch({reduce: true},'shipments-by-count');
    Promise.all([shipments_promise,shipments_value_promise,shipments_transactions_promise]).then((results)=>{
      $("#shipments-summary").html(ShipmentsSummaryTemplate(results));
      this.showSummary();
      this.showShipments();
    });
  },
});
