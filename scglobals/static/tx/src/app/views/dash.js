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
  initialize: function(options,userSettings){
    this.userSettings = userSettings;
    this.filterView = new FilterView(userSettings);
    this.shipmentsCollection = new ShipmentsCollection();
    Backbone.on('FilterUpdated',this.filterUpdated,this);
    this.render(options);
  },
  toggleShipments: function(){
    $("#loading").toggle();
    $("#shipments-loading-container").toggleClass('hidden');
  },
  _loadShipments: function(options){
    // get numbers
    var total_shipments_promise = this.shipmentsCollection.fetch(options,'shipments-by-date',true);
    var shipments_value_promise = this.shipmentsCollection.fetch(options,'shipments-by-value',true);
    var shipments_transactions_promise = this.shipmentsCollection.fetch(options,'shipments-by-count',true);
    // get shipments for display
    var all_shipments_promise = this.shipmentsCollection.fetch(options).then((shipments)=>{
      $("#shipments").html(this.shipmentsTemplate(shipments.doc_rows));
      return shipments.total_rows;
    });
    Promise.all([total_shipments_promise,shipments_value_promise,shipments_transactions_promise,all_shipments_promise]).then((results)=>{
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
      this.toggleShipments();
    });
  },
  render: function(options) {
    options = options || {};
    options.startkey = [this.userSettings.get('location'),{}];
    options.endkey = [this.userSettings.get('location')];
    this.$el.html(this.template());
    this.$el.find('.filters').append(this.filterView.$el);
    this._loadShipments(options);
  },
  filterUpdated: function(options,filter_description){
    this.toggleShipments();
    this._loadShipments(options);
    $("#filter-description").html(": " + filter_description);
  }
});
