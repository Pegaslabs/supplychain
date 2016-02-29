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
    return this.db.query(q,ops).then((result)=> {
      // making rows straight up docs instead of {_id,_rev,doc} bs
      if (!ops['reduce']){
        result['doc_rows'] = _.pluck(result.rows, 'doc');
        // delete result['rows'];
      }
      else {
        if (result.rows.length) {
          return result.rows[0].value;
        }
        else{
          return 0;
        }
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
