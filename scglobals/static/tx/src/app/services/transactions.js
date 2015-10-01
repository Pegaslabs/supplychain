// transforms & saves new transactions from server to local pouchdb 

export default class TransactionsService {
  constructor(db) {
    this.db = db;
    // this needs to corralate to raw sql query in 
    // raw_stockchanges.py
    // except 'doc_type', which will be "transaction"
     // and is unshifted onto the data
    this.transactionHeaders = [
      "doc_type",
      "shipment_date",
      "location_name",
      "from_location_name",
      "from_location_location_type",
      "to_location_name",
      "to_location_location_type",
      "item_name",
      "item_category_name",
      "item_lot_expiration",
      "item_lot_lot_num",
      "item_lot_unit_price",
      "qty",
      "username",
      "modified",
      "total_value", 
      "stockchange_id",
      "shipment_id",
      "item_lot_id",
      "item_id"]
  }
  saveTransactions(transactions){
    let mappedTransactions = _.map(transactions,(transaction)=>{
      transaction.unshift("transaction");
      return _.object(this.transactionHeaders,transaction);
    });
    return {response: this.db.bulkDocs(mappedTransactions), transactions: transactions};
  }
}