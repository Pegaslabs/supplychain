import PouchDB from 'pouchdb';
import InitialQueries from './initialqueries'
import Config from './../services/config';

// interface for CRUD to our couchdb data via pouchdb

export default class DB {
  constructor() {
    this.config = new Config();
    this.db = new PouchDB(this.config.dbUrl + this.config.dbName);
    this.db.on('error', function (err) { console.log(err) });
    this.initialQueries = new InitialQueries(this.db);
  }
  destroy(){
    return this.db.destroy();
  }
  initdb(){
    return this.db.get('_design/shipments-by-date').catch((err) => {
      return this.initialQueries.saveDefaultQueries(this.db);
    });
  }
  bulkDocs(docs){
    return this.db.bulkDocs(docs);
  }
  query(q,ops){
    // putting here instead of in constructor as _.extend modifies actual object
    var default_options = {reduce:false,limit:1000,include_docs:true};
    if (!ops){
      ops = default_options;
    }
    else if (!ops['reduce']){
      ops = _.extend(ops,default_options);
    }
    return this.db.query(q,ops).then((result)=> {
      // making rows straight up docs instead of {_id,_rev,doc} bs
      if (!ops['reduce']){
        result['doc_rows'] = _.pluck(result.rows, 'doc');
        delete result['rows'];
      }
      else{
        return result.rows[0].value;
      }
      return result;
    }).catch(function (err) {
      return err;
    });
  }
  get(docId){
    return this.db.get(docId);
  }
}