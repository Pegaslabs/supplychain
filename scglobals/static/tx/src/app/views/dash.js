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
    $("#loading").fadeOut('fast');
    $("#shipments").removeClass('hidden').hide().fadeIn(1000);
  },
  render: function() {
    this.$el.html(this.template());
    this.shipmentsCollection.fetch().then((shipments)=>{
      $("#shipments").html(this.shipmentsTemplate(shipments));
      this.showShipments();
    });
  },
});
