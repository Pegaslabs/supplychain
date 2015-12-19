import ShipmentsCollection from './../collections/shipments';
import ShipmentModel from './../models/shipment';
import ServerShipmentsCollection from './../collections/server-shipments';
import ConvertDjangoDataService from './../services/convert-django-data';
import DB from './../services/db';

// migration service for temporary migration
// until fully off django

export default class Migration {
  constructor(shipmentIds) {
    this.totalShipments = shipmentIds.length;
    this.offset = 0;
    this.shipmentIds = shipmentIds;
    this.limit = 25;
    this.db = new DB();
    this.convertDjangoDataService = new ConvertDjangoDataService();
    this.serverShipmentsCollection = new ServerShipmentsCollection();
  }
  _convertAndSaveShipment(django_transactions){
    var transactions = [], shipment_model, shipment, shipments_models;
    // our server response is at the transaction level
    // so we need to split them into shipments.
    shipments_models = _.map(this.serverShipmentsCollection.urlParams.idsBetween,(id)=>{
      // prep a shipment object to be saved in couch
      // (we should never have an empty length because the sql length )
      transactions = _.reduce(django_transactions,function(result,t){
        // shipment_id is at position 16
        if (t[16] === id) result.push(t);
        return result;
      },[]);
      shipment_model = new ShipmentModel(this.convertDjangoDataService.shipmentFromTransactions(transactions));
      // shipment_model.set('transactions',this.convertDjangoDataService.convertTansactions(transactions));
      return shipment_model;
    });
    return this.db.bulkDocs(new ShipmentsCollection(shipments_models).toJSON());
  }
  _loadAndSave(){
    return this.serverShipmentsCollection.fetch()
    .then((data)=>{
      return this._convertAndSaveShipment(data);
    })
    .then(()=>{
      // update our counters & url params
      this.offset += this.limit;
      this.serverShipmentsCollection.urlParams.idsBetween = this.shipmentIds.slice(this.offset,this.offset+this.limit);
      Backbone.trigger('MigrationProgress',this.offset);
      if (this.offset < this.totalShipments) return this._loadAndSave();
      else return true;
    })
  }
  start(){
    this.serverShipmentsCollection.urlParams = {ascordesc: "asc",idsBetween: this.shipmentIds.slice(this.offset,this.offset+this.limit)};
    return this.db.destroy().then((response) => {
      this.db = new DB();
      return this.db.initdb().then(()=>{
        return this._loadAndSave();
      });
    });
  }
}