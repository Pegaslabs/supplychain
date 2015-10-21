import PouchDB from 'pouchdb';
import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import ServerStockChangeCollection from './../collections/server-sc-collection';
import LocalDB from './../services/localdb'

// service for syncing local with server.

export default class SyncService {
  constructor() {
    this.localDB = new LocalDB();
    this.scs = new ServerStockChangeCollection();
    // will be either a date or an id
    this.latestCached = "0";
  }
  _checkLatest(checkIDs){
    var options = {"count":true, ascordesc: "asc"};
    options[this.idOrModifiedDate] = this.latestCached;
    return this.scs.fetch({
      data: $.param(options)
    }).then((data)=>{
      return data[0][0];
    });
  }
  _loadAndSaveLoop(delta,offset){
    offset = offset || 0;
    var options = {limit:1000,ascordesc: "asc",offset: offset};
    options[this.idOrModifiedDate] = this.latestCached;
    return this.scs.fetch({
      data: $.param(options)
    })
    .then((data)=>{
      offset += data.length;
      return this.localDB.saveTransactions(data)
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
  // starts by making sure we have the latest IDs, 
  // then makes sure nothing has been modified that's already existing
  _checkAndStart(checkIDs){
    this.query = checkIDs ? 'scbyid' : 'scbymodified';
    this.idOrModifiedDate = checkIDs ? 'id' : 'modified';
    return this.localDB.initdb()
    .then(()=>{return this.localDB.query(this.query)})
    .then((result)=>{
      if (result.length && checkIDs) this.latestCached = result[0].stockchange_id;
      else if (result.length && !checkIDs) this.latestCached = result[0].modified;
      return this._checkLatest().then((delta)=>{
        if (delta){
          Backbone.trigger('syncingStarted',10000);
          return this._loadAndSaveLoop(10000);
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