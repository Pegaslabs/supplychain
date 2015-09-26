import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import PouchDB from 'pouchdb';
import LocalDB from './../services/localdb'

import LoadTemplate from './../templates/load-tpls.hbs';
import StockChangeCollection from './../collections/sc-collection';
import ServerStockChangeCollection from './../collections/server-sc-collection';

export default Backbone.View.extend({

  template: LoadTemplate,
  el: '#content',
  initialize: function(){
    this.localDB = new LocalDB("txdb");
  },
  loadSCS: function(startDate){
    let scs = new StockChangeCollection();
    return scs.fetch({
      data: $.param({limit: 100, ascordesc: "asc", modified:startDate})
    }).then((data)=>{
      return data;
    });
  },
  startLoading: function(startDate){
    this.loadSCS(startDate)
    .then((data)=>{
      // return this.localDB.saveTransactions(data)
    })
    .then((data)=>{
      console.log(data);
    });
  },
  render: function() {
    this.localDB.initdb().then(()=>{
      this.localDB.query('scbymodified').then((result)=>{
        if (!result.length){
          this.startLoading('1990-01-01');
        }
        else{
          console.log("found local",result);
        }
      });
    });
    this.$el.empty().append();
  },
});
