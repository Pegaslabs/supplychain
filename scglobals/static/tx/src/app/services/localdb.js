import PouchDB from 'pouchdb';
import InitialQueries from './initialqueries'
import TransactionsService from './transactions'

// interface for CRUD to our offline data via pouchdb

export default class LocalDB {
  constructor(dbname) {
    this.db = new PouchDB(dbname);
    this.initialQueries = new InitialQueries(this.db);
    this.transactionsService = new TransactionsService(this.db);
  }
  destroy_db(){
    return this.db.destroy();
  }
  initdb(){
    return this.db.get('_design/scbymodified').catch((err) => {
      return this.initialQueries.saveDefaultQueries(this.db);
    });
  }
  query(q,ops){
    let ops = ops || {reduce:false};
    return this.db.query(q,ops).then((result)=> {
      return _.pluck(result.rows, 'value');
    });
  }
  saveTransactions(transactions){
    return this.transactionsService.saveTransactions(transactions)
  }
}