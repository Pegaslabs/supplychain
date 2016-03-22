import Backbone from 'backbone';
import DB from './../services/db';

export default Backbone.Model.extend({
  defaults:{
    query: null,
    include_sum: true,
    options: {
      limit: 1000,
      descending: true,
      reduce: false,
      include_docs: true
    },
  },
  initialize: function(){
    this.db = new DB();
  },
  fetch: function(){
    var options = this.get('options');
    if (options.reduce) {
      delete options.limit;
      delete options.skip;
      delete options.descending;
      delete options.include_docs;
      if (options.startkey){
        var startkeyholder = options.startkey;
        options.startkey = options.endkey;
        options.endkey = startkeyholder;
      }
    }
    return this.db.query(this.get('query'),options).then((results)=>{
      this.set('results',results);
      return results;
    });
  }
});
