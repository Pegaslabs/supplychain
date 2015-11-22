import PouchDB from 'pouchdb';
import InitialQueries from './initialqueries'
import TransactionsService from './transactions'
import Config from './../services/config';

// interface for CRUD to our offline data via pouchdb

export default class LocalDB {
  constructor() {
    this.config = new Config();
    this.db = new PouchDB(this.config.dbname);
    this.db.on('error', function (err) { console.log(err) });
    this.initialQueries = new InitialQueries(this.db);
    this.transactionsService = new TransactionsService(this.db);
  }
  destroy_db(){
    return this.db.destroy();
  }
  initdb(){
    return this.db.get('_design/shipmentsbydate').catch((err) => {
      return this.initialQueries.saveDefaultQueries(this.db);
    });
  }
  query(q,ops){
    ops = _.extend(
      {reduce:false,limit:1000,include_docs:true},ops);
    return this.db.query(q,ops).then((result)=> {
      return _.pluck(result.rows, 'doc');
    }).catch(function (err) {
      console.log(err);
      return err;
    });
  }
}