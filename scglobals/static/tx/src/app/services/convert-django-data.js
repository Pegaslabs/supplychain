// transforms & saves new transactions from server to local pouchdb 

export default class TransactionsService {
  constructor() {
    // this needs to corralate to raw sql query in 
    // raw_stockchanges.py
    // except 'doc_type', which will be "transaction"
     // and is unshifted onto the data
    this.transaction_headers = [
      "date",
      "django_location_name",
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
      "django_stockchange_id",
      "django_shipment_id",
      "django_item_lot_id",
      "django_item_id"];
    this.shipment_headers = [
      "date",
      "django_location_name",
      "from_location_name",
      "from_location_location_type",
      "to_location_name",
      "to_location_location_type",
      "django_shipment_id"];
  }
  // take array of values without keys and add keys
  convertTansactions(transactions){
    var newTransaction;
    return _.map(transactions,(server_transaction)=>{
      // _.object takes list of keys & list of values & makes object
      newTransaction = _.object(this.transaction_headers,server_transaction);
      newTransaction['total_value'] = Number(newTransaction['total_value']) || 0;
      newTransaction['django'] = true;
      // strip fields we do not need as they're on shipment
      newTransaction = _.omit(newTransaction,this.shipment_headers);
      return newTransaction;
    });
  }
  // expecting the key-less server response transaction
  // server transaction:
  // ["2013-07-01", "Central Warehouse", "Initial Warehouse Count", "S", "Central Warehouse", "I", "Alcophyllex 200ml", "SYRUPS, MIXTURE, SUSPENSIONS ETC", "2014-07-01", null, 6.35, 64, "system", "2014-02-04", 406.4, 1, 1, 1, 3]
  shipmentFromTransaction(transaction){
    var transactionForShipmentFields,newShipment;
    // need an actual copy, not a reference
    transactionForShipmentFields = transaction.slice();
    // put 'transaction' in front of the array so doc_type has a value
    newShipment = _.object(this.transaction_headers,transactionForShipmentFields);
    newShipment = _.pick(newShipment,this.shipment_headers);
    return _.extend(newShipment,{django: true, doc_type: 'shipment'});
  }
}