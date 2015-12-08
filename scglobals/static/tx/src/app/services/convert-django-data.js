// transforms & saves new transactions from server to local pouchdb 

export default class TransactionsService {
  constructor() {
    // this needs to corralate to raw sql query in 
    // raw_stockchanges.py
    // except 'doc_type', which will be "transaction"
     // and is unshifted onto the data
    this.transaction_headers = [
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
      "item_id"];
    this.shipment_headers = [
      "shipment_date",
      "location_name",
      "from_location_name",
      "from_location_location_type",
      "to_location_name",
      "to_location_location_type",
      "shipment_id"];
  }
  // take array of values without keys and add keys
  convertTansactions(transactions){
    return _.map(transactions,(transaction)=>{
      // put 'transaction' in front of the array so doc_type has a value
      transaction.unshift("transaction");
      // _.object takes list of keys & list of values & makes object
      transaction = _.object(this.transaction_headers,transaction);
      transaction['total_value'] = Number(transaction['total_value']) || 0;
      transaction['django'] = true;
      // strip fields we do not need as they're on shipment
      _.omit(transaction,this.shipment_headers);
      return transaction;
    });
  }
  // expecting the key-less server response transaction
  // server transaction:
  // ["2013-07-01", "Central Warehouse", "Initial Warehouse Count", "S", "Central Warehouse", "I", "Alcophyllex 200ml", "SYRUPS, MIXTURE, SUSPENSIONS ETC", "2014-07-01", null, 6.35, 64, "system", "2014-02-04", 406.4, 1, 1, 1, 3]
  shipmentFromTransaction(transaction){
    var shipment = {'django': true};
    // put 'transaction' in front of the array so doc_type has a value
    transaction.unshift("transaction");
    transaction = _.object(this.transaction_headers,transaction);
    return _.pick(transaction,this.shipment_headers);
  }
}