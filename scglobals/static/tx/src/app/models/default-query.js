import Backbone from 'backbone';
import DB from './../services/db';

export default Backbone.Model.extend({
  defaults:{
    query: null,
    include_sum: true,
    results: null,
    // start options to include in couchdb query
    limit: 1000,
    descending: true,
    reduce: false,
    include_docs: true
  },
  initialize: function(){
    this.db = new DB();
  },
  fetch: function(){
    var options = {};
    if (this.get('reduce')) {
      options.reduce = true;
      // need to reverse keys for reduce
      // else couchdb lookup error
      if (this.get('startkey')){
        options.startkey = this.get('endkey');
        options.endkey = this.get('startkey');
      }
    } else{
      options = this.toJSON();
      delete options.query;
      delete options.include_sum;
      delete options.results;
    }
    return this.db.query(this.get('query'),options).then((results)=>{
      this.set('results',results);
      return results;
    });
  }
});
