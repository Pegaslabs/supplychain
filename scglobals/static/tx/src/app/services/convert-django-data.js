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
      "from_location_type",
      "to_location_name",
      "to_location_type",
      "item_name",
      "item_category_name",
      "item_lot_expiration",
      "item_lot_num",
      "item_lot_unit_price",
      "qty",
      "username",
      "modified",
      "total_value",
      "django_stockchange_id",
      "django_shipment_id",
      "django_item_lot_id",
      "django_item_id",
      "django_item_dispense_size"];
    this.shipment_headers = [
      "date",
      "django_location_name",
      "from_location_name",
      "from_location_type",
      "to_location_name",
      "to_location_type",
      "django_shipment_id"];
  }
  _cleanTransaction(transaction){
    return _.map(transaction, function(field){
      if (typeof(field) === 'string'){
        field = field.trim();
      }
      return field;
    });
  }
  // take array of values without keys and add keys
  _convertTansactions(transactions){
    var new_transaction;
    return _.map(transactions,(server_transaction)=>{
      server_transaction = this._cleanTransaction(server_transaction);
      // _.object takes list of keys & list of values & makes object
      new_transaction = _.object(this.transaction_headers,server_transaction);
      new_transaction['total_value'] = Number(new_transaction['total_value']) || 0;
      new_transaction['django'] = true;
      // translating everything to dispense size
      // django system was built to have everything in a "pack" size
      // until it was transferred to a dispensary (type "D").
      // here, we need everything uniform for couchdb sum reduces to work
      // so this does the "translation" backwards and puts everything in dispense size
      if (new_transaction.django_item_dispense_size !== 1){
        if (new_transaction.from_location_type !== 'D' && new_transaction.to_location_type !== 'D'){
          new_transaction.qty = (new_transaction.qty * new_transaction.django_item_dispense_size);
        }
        // fix price on dispense shipments
        else if (new_transaction.django_item_dispense_size){
          new_transaction.total_value = new_transaction.total_value / new_transaction.django_item_dispense_size
        }
      }
      // strip fields we do not need as they're on shipment
      new_transaction = _.omit(new_transaction,this.shipment_headers);
      return new_transaction;
    });
  }
  // expecting the key-less server response transaction
  // server transaction:
  // ["2013-07-01", "Central Warehouse", "Initial Warehouse Count", "S", "Central Warehouse", "I", "Alcophyllex 200ml", "SYRUPS, MIXTURE, SUSPENSIONS ETC", "2014-07-01", null, 6.35, 64, "system", "2014-02-04", 406.4, 1, 1, 1, 3, 1]
  shipmentFromTransactions(server_transactions){
    var transaction_for_shipment_fields,new_shipment;
    // need an actual copy, not a reference
    transaction_for_shipment_fields = server_transactions[0].slice();
    transaction_for_shipment_fields = this._cleanTransaction(transaction_for_shipment_fields);
    // put 'transaction' in front of the array so doc_type has a value
    new_shipment = _.object(this.transaction_headers,transaction_for_shipment_fields);
    new_shipment = _.pick(new_shipment,this.shipment_headers);
    new_shipment['total_transactions'] = server_transactions.length;
    new_shipment['transactions'] = this._convertTansactions(server_transactions);
    new_shipment['total_value'] = _.reduce(new_shipment['transactions'], function(result, transaction){
      if (Number(transaction['total_value'])){
        return result + Number(transaction['total_value']);
      }
      else{
        return result;
      }
    }, 0);
    return _.extend(new_shipment,{django: true, doc_type: 'shipment'});
  }
}
