import PouchDB from 'pouchdb';
import PouchDBAuth from 'pouchdb-authentication';
import CreateCouchViews from './create-couch-views';
import Config from './../services/config';

// interface for CRUD to our couchdb data via pouchdb

// singleton config object
let db_instance = null;
export default class DB {
  constructor() {
    if (!db_instance){
      db_instance = this;
    } else{
      return db_instance;
    }
    this.config = new Config();
    PouchDB.plugin(PouchDBAuth);
    this.db = new PouchDB(this.config.dbUrl + this.config.dbName);
    this.db.on('error', function (err) { console.log(err) });
    this.createCouchViews = new CreateCouchViews(this.db);
    return db_instance;
  }
  destroy(){
    return this.db.destroy();
  }
  initdb(){
    return this.db.get(this.createCouchViews.couch_views[0].name).catch((err) => {
      return this.createCouchViews.create();
    });
  }
  bulkDocs(docs){
    return this.db.bulkDocs(docs);
  }
  query(q,ops){
    return this.db.query(q,ops).catch(function(error){
      // TODO: get this into router
      if (error.status === 401){
        window.location.href = "/#/login";
      }
    });
  }
  get(docId){
    return this.db.get(docId);
  }
}
