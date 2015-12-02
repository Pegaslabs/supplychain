import PouchDB from 'pouchdb';
import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import ServerStockChanges from './../collections/server-stockchanges';
import DB from './../services/db';

// service for syncing local with server.

export default class SyncService {
  constructor() {
    this.db = new DB();
    this.serverStockChanges = new ServerStockChanges();
    // will be either a date or an id
    this.latestCached = "0";
  }
  _checkLatest(checkIDs){
    var options = {"count":true, ascordesc: "asc"};
    options[this.idOrModifiedDate] = this.latestCached;
    return this.serverStockChanges.fetch({
      data: $.param(options)
    }).then((data)=>{
      return data[0][0];
    });
  }
  _loadAndSaveLoop(delta,offset){
    offset = offset || 0;
    var options = {limit:3,ascordesc: "asc",offset: offset};
    options[this.idOrModifiedDate] = this.latestCached;
    if (this.idOrModifiedDate === "shipment_id"){
      options[this.idOrModifiedDate] = (Number(this.latestCached) + Number(offset));
      delete options.offset;
    }
    return this.serverStockChanges.fetch({
      data: $.param(options)
    })
    .then((data)=>{
      offset += data.length;
      // return this.db.saveTransactions(data)
      return data;
    })
    .then((response)=>{
      Backbone.trigger('savedTransactions',delta,offset,response.transactions);
      if (offset < delta){
        return this._loadAndSaveLoop(delta,offset);
      }
      else{
        Backbone.trigger('syncingComplete',delta,offset,response.transactions);
        return true;
      }
    })
  }
  // returns the number of transactions on the server we don't have locally
  // starts by making sure we have the latest shipments by IDs, 
  // then looks for stock changes modified later than our latest stockchange
  _checkAndStart(checkIDs){
    this.query = checkIDs ? 'sbyid' : 'scbymodified';
    this.idOrModifiedDate = checkIDs ? 'shipment_id' : 'modified';
    return this.db.initdb()
    .then(()=>{return this.db.query(this.query)})
    .then((result)=>{
      if (result.length && checkIDs) this.latestCached = result[0].stockchange_id;
      else if (result.length && !checkIDs) this.latestCached = result[0].modified;
      return this._checkLatest().then((delta)=>{
        if (delta){
          Backbone.trigger('syncingStarted',1000);
          return this._loadAndSaveLoop(1000);
        }
        else{
          Backbone.trigger('upToDate');
          return true;
        }
      });
    });
  }
  start(){
    this._checkAndStart(true).then(()=>{
      this._checkAndStart(false);
    });
  }
}