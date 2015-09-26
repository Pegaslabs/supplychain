import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import PouchDB from 'pouchdb';
import ServerStockChangeCollection from './../collections/server-sc-collection';

export default ServerStockChangeCollection.extend({
   parse: function(result) {
    return _.pluck(result.rows, 'doc');
  },
  fetch: function(options){
    // console.log(options);
    return Backbone.Collection.prototype.fetch.call(this, options).then(function(data){
      // console.log(data);
      return data;
    });
  }
});