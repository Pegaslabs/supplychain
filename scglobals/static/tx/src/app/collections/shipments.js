import _ from 'lodash';
import Backbone from 'backbone';
import DB from './../services/db';
import TablesCollection from './tables-collection';

export default TablesCollection.extend({
  query: 'shipments-by-date',
  initialize: function(){
    this.db = new DB();
  },
  save: function(){
    return this.db.bulkDocs(this.toJSON());
  },
  fetch: function(input_options,query,reduce){
    var options = _.clone(input_options) || {};
    if (reduce) {
      options.reduce = true;
      delete options.limit;
      delete options.include_docs;
      delete options.skip;
      delete options.descending;
      if (options.startkey){
        var startkeyholder = options.startkey;
        options.startkey = options.endkey;
        options.endkey = startkeyholder;
      }
    }
    else {
      options.limit = options.limit || 1000;
      options.include_docs = true;
      options.reduce = false;
      options.descending = true;
    }
    //
    // if (options.startkey){
    //   options.descending = false;
    // }
    query = query || this.query;
    return this.db.query(query,options);
  }
});
