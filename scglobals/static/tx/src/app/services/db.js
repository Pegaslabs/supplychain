import PouchDB from 'pouchdb';
import CreateCouchViews from './create-couch-views';
import Config from './../services/config';

// interface for CRUD to our couchdb data via pouchdb

export default class DB {
  constructor() {
    this.config = new Config();
    this.db = new PouchDB(this.config.dbUrl + this.config.dbName);
    this.db.on('error', function (err) { console.log(err) });
    this.createCouchViews = new CreateCouchViews(this.db);
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
    return this.db.query(q,ops);
  }
  get(docId){
    return this.db.get(docId);
  }
}
