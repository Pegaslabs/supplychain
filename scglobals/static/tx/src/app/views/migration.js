import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import ShipmentsCollection from './../collections/shipments';
import ServerShipmentsCollection from './../collections/server-shipments';
import MigrationProgress from './../templates/migration-progress.hbs';

export default Backbone.View.extend({
  template: MigrationProgress,
  el: "#migration-progress",
  totalShipments: 0,
  shipmentIds: [],
  initialize: function(){
    this.shipmentsCollection = new ShipmentsCollection();
    this.serverShipmentsCollection = new ServerShipmentsCollection();
  },
  render: function(){
    this.pct = this.offset / this.totalShipments;
    this.$el.html(this.template({offset: this.offset, pct: this.pct, totalShipments: this.totalShipments}));
  },
  _loadAndSave: function(){
    return this.serverShipmentsCollection.fetch()
    .then((data)=>{
      this.offset += data.length;
      this.serverShipmentsCollection.idsBetween = this.shipmentIds.slice(this.offset,this.offset+4);
      return this.shipmentsCollection.convertFromTransactions(data);
    })
    .then((response)=>{
      this.render();
      if (this.offset < this.totalShipments) return this._loadAndSave();
      else return true;
    })
  },
  migrate: function(shipmentIds) {
    this.totalShipments = shipmentIds.length;
    this.shipmentIds = shipmentIds;
    this.offset = 0;
    this.render();
    this.serverShipmentsCollection.urlParams = {ascordesc: "asc",idsBetween: this.shipmentIds.slice(this.offset,this.offset+4)};
    return this._loadAndSave();
  }
});