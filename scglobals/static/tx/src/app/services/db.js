import $ from 'jquery';
import PouchDB from 'pouchdb';
import PouchDBAuth from 'pouchdb-authentication';
import CreateCouchViews from './create-couch-views';
import Config from './../models/config';

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
    PouchDB.plugin(PouchDBAuth);
    this.config = new Config();
    this.createCouch();
    return db_instance;
  }
  bulkDocs(docs){
    return this.db.bulkDocs(docs);
  }
  get(docId){
    return this.db.get(docId);
  }
  createCouch(){
    this.db = new PouchDB(this.config.get('dbUrl') + this.config.get('dbName'),{ ajax: {timeout: false} });
    this.db.on('error', function (err) { console.log(err) });
    this.createCouchViews = new CreateCouchViews(this.db);
  }
  destroy(){
    return this.db.destroy();
  }
  initdb(){
    return this.db.get('_design/' + this.createCouchViews.couch_views[0].name).catch((err) => {
      return this.secureDB().then(()=>{
        return this.createCouchViews.create();
      });
    });
  }
  checkAuthentication(){
    if (this.checkedAuth){
      return this.isAuthenticated;
    }
    else{
      return this.db.get('_design/' + this.createCouchViews.couch_views[0].name).catch((err) => {
        if (err.status === 401){
          this.isAuthenticated = false;
        } else{
          this.isAuthenticated = true;
        }
        this.checkedAuth = true;
        return this.isAuthenticated;
      });
    }
  }
  login(username,pass){
    return this.db.login(username,pass);
  }
  logout(){
    return this.db.logout();
  }
  query(q,ops){
    return this.db.query(q,ops);
  }
  secureDB(){
    var securityDoc = {"admins":{"names":[],"roles":[]},"members":{"names":["admin"],"roles":[]}};
    return $.ajax({
      method: "PUT",
      url: this.config.get('dbUrl') + this.config.get('dbName') + "/_security",
      xhrFields: {withCredentials: true},
      data: JSON.stringify(securityDoc)
    });
  }
  // force couch to start indexing
  // not sure why, but couch doesn't seem to show tasks creating these indexes
  // until they're first queried.
  triggerAllQueryIndexBuild(){
    _.each(this.createCouchViews.couch_views,(view)=>{
      this.db.query(view.name);
    });
  }
}
