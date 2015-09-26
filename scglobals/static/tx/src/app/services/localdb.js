import PouchDB from 'pouchdb';
import InitialQueries from './initialqueries'
import TransactionsService from './transactions'

// interface for working with pouchdb & offline data

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
  query(q){
    return this.db.query(q).then((result)=> {
      console.log(result);
      return _.pluck(result.rows, 'doc');
    })
  }
  saveTransactions(transactions){
    return this.transactionsService.saveTransactions(transactions)
  }
}