import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import ShipmentsCollection from './../collections/shipments';
import ShipmentModel from './../models/shipment';
import ServerShipmentsCollection from './../collections/server-shipments';
import ConvertDjangoDataService from './../services/convert-django-data';
import MigrationProgress from './../templates/migration-progress.hbs';

export default Backbone.View.extend({
  template: MigrationProgress,
  el: "#migration-progress",
  totalShipments: 0,
  shipmentIds: [],
  limit: 25,
  initialize: function(){
    this.convertDjangoDataService = new ConvertDjangoDataService();
    this.serverShipmentsCollection = new ServerShipmentsCollection();
  },
  render: function(){
    this.pct = (this.offset / this.totalShipments)*100;
    this.$el.html(this.template({offset: this.offset, pct: this.pct, totalShipments: this.totalShipments}));
  },
  _convertAndSaveShipment: function(django_transactions){
    var transactions = [], shipment_model, shipment, shipments_models;
    // our server response is at the transaction level
    // so we need to split them into shipments.
    shipments_models = _.map(this.serverShipmentsCollection.urlParams.idsBetween,function(id){
      // prep a shipment object to be saved in couch
      // (we should never have an empty length because the sql length )
      transactions = _.map(django_transactions,function(t){
        // shipment_id is at position 16
        if (t[16] === id) return t;
      });
      shipment_model = new ShipmentModel(this.convertDjangoDataService.shipmentFromTransaction(transactions[0]));
      shipment_model.transactions = this.convertDjangoDataService.convertTansactions(transactions);
      return shipment_model;
    });
    return this.db.bulkDocs(new ShipmentsCollection(shipments_models).toJSON());
  },
  _loadAndSave: function(){
    return this.serverShipmentsCollection.fetch()
    .then((data)=>{
      return this._convertAndSaveShipment(data);
    })
    .then(()=>{
      // update our counters & url params
      this.offset += this.limit;
      this.serverShipmentsCollection.urlParams.idsBetween = this.shipmentIds.slice(this.offset,this.offset+this.limit);
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
    this.serverShipmentsCollection.urlParams = {ascordesc: "asc",idsBetween: this.shipmentIds.slice(this.offset,this.offset+this.limit)};
    return this._loadAndSave();
  }
});
