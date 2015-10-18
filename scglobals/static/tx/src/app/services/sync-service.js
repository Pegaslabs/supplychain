import PouchDB from 'pouchdb';
import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import ServerStockChangeCollection from './../collections/server-sc-collection';
import LocalDB from './../services/localdb'

// service for syncing local with server.

export default class SyncService {
  constructor() {
    this.localDB = new LocalDB("txdb");
    this.scs = new ServerStockChangeCollection();
    // I do not like this
    this.latestCachedChange = "1901-01-01";
  }
  _checkLatest(startDate){
    return this.scs.fetch({
      data: $.param({"count":true, ascordesc: "asc", modified:startDate})
    }).then((data)=>{
      return data[0][0];
    });
  }
  _loadAndSaveLoop(delta,offset){
    offset = offset || 0;
    return this.scs.fetch({
      data: $.param({
        limit:100, 
        ascordesc: "asc", 
        modified:this.latestCachedChange,
        offset: offset
      })
    })
    .then((data)=>{
      offset += data.length;
      return this.localDB.saveTransactions(data)
    })
    .then((response)=>{
      Backbone.trigger('savedTransactions',delta,offset,response.transactions);
      if (offset < delta){
        this._loadAndSaveLoop(delta,offset);
      }
      else{
        Backbone.trigger('syncingComplete',delta,offset,response.transactions);
      }
    })
  }
  // returns the number of transactions on the server we don't have locally
  start(){
    return this.localDB.initdb()
    .then(()=>{return this.localDB.query('scbymodified',{reduce: true})})
    .then((result)=>{
      if (!result.length){
        return this._checkLatest(this.latestCachedChange).then((delta)=>{
          Backbone.trigger('syncingStarted',delta);
          this._loadAndSaveLoop(1000);
          return false;
        });
      }
      else{
        Backbone.trigger('upToDate',result[0]);
        return result[0];
      }
    });
  }
}