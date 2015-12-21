import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import DashTemplate from './../templates/dash.hbs';
import ShipmentsSummaryTemplate from './../templates/shipments-summary.hbs';
import ShipmentsTemplate from './../templates/shipments.hbs';
import ShipmentsCollection from './../collections/shipments';
import FilterView from './../views/filter';

export default Backbone.View.extend({

  template: DashTemplate,
  shipmentsTemplate: ShipmentsTemplate,
  el: '#container',
  initialize: function(){
    this.filterView = new FilterView();
    this.shipmentsCollection = new ShipmentsCollection();
    Backbone.on('FilterUpdated',this.filterUpdated,this);
  },
  showShipments: function(){
    $("#loading").hide()
    $("#shipments").removeClass('hidden').hide().fadeIn(500);
  },
  showSummary: function(){
    $("#loading-summary").fadeOut('fast');
    $("#shipments-summary").removeClass('hidden').hide().fadeIn(500);
  },
  render: function(options) {
    options = options || {};
    this.$el.html(this.template());
    this.filterView.render();
    $("#filters").html(this.filterView.$el);
    var shipments_promise = this.shipmentsCollection.fetch(options).then((shipments)=>{
      $("#shipments").html(this.shipmentsTemplate(shipments.doc_rows));
      return shipments.total_rows;
    });
    var shipments_value_promise = this.shipmentsCollection.fetch(options,'shipments-by-value',true);
    var shipments_transactions_promise = this.shipmentsCollection.fetch(options,'shipments-by-count',true);
    Promise.all([shipments_promise,shipments_value_promise,shipments_transactions_promise]).then((results)=>{
      var shipmentSummary = {
        date_string: "",
        total_shipments: results[0],
        total_value: results[1],
        total_transactions: results[2],
        skip: options.skip || 0,
        limit: options.limit || 1000,
        previousURLParams: this.shipmentsCollection.makePreviousUrlParams(options),
        nextURLParams: this.shipmentsCollection.makeNextUrlParams(options)
      };
      $("#shipments-summary").html(ShipmentsSummaryTemplate(shipmentSummary));
      if (Number(shipmentSummary.skip) === 0){
        $("#previous").addClass('disabled');
      }
      if (Number(shipmentSummary.skip) + Number(shipmentSummary.limit) > shipmentSummary.total_shipments){
        $("#next").addClass('disabled');
      }
      this.showSummary();
      this.showShipments();
    });
  },
  filterUpdated: function(options,filter_description){
    $("#filter-description").html(": " + filter_description);
  }
});
