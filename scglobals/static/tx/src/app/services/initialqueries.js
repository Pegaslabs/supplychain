import PouchDB from 'pouchdb';

export default class InitialQueries {
  constructor(db){
    this.db = db;
  }
  additionalQueries(){
    // for stock cards
    var allTransactions = function(doc){
        if (doc.doc_type && doc.doc_type === "shipment"){
          // in absence of an "OR"-like operator in couchdb queries,
          // using two emits to allow for filtering on both from & to location
          // ordering: item first, then date, then shipment id, then order it was emitted (i),
          // then 0 for "From" and 1 for "To", to determine positive or negative
          // then from or to location for location filtering
          doc.transactions.forEach(function(transaction,i){
            emit([transaction.item_name,transaction.item_category_name,doc.date,doc._id,i,0,doc.from_location_name,transaction.item_lot_expiration,transaction.item_lot_lot_num,doc.from_location_name,doc.to_location_name], transaction.qty);
            emit([transaction.item_name,transaction.item_category_name,doc.date,doc._id,i,1,doc.to_location_name,transaction.item_lot_expiration,transaction.item_lot_lot_num,doc.from_location_name,doc.to_location_name], transaction.qty);
          });
        }
    }.toString();
    // used for getting a list of unique items.
    // run this with a reduce http://stackoverflow.com/questions/5456682/return-unique-values-by-key-in-couchdb
    var itemsByName = function(doc){
        if (doc.doc_type && doc.doc_type === "shipment"){
          doc.transactions.forEach(function(transaction,i){
            emit([transaction.item_name,transaction.item_category_name], 1);
          });
        }
    }.toString();
    return [
      {
        _id: '_design/all-transactions',
        views:{
          'all-transactions': {
            map: allTransactions,
            reduce: '_sum'
          }
        },
      },
      {
        _id: '_design/items-by-name',
        views:{
          'items-by-name': {
            map: itemsByName,
            reduce: '_sum'
          }
        }
      }
    ];
  }
  // usage: override reduce property if you need a _sum, default (see below) is count
  saveDefaultQueries(){
    let querytypes = [
      // {queryName: 'shipments-by-date', doc_type: 'shipment', queryEmit: 'doc.date,doc.total_value'},
      {queryName: 'shipments-by-date', doc_type: 'shipment', queryEmit: '[doc.date,doc.from_location_name,doc.to_location_name],doc.total_value'},
      // for sum of total value (when working, use sum & skip "count" of shipments)
      {queryName: 'shipments-by-value', doc_type: 'shipment', queryEmit: '[doc.date,doc.from_location_name,doc.to_location_name], doc.total_value', reduce: '_sum'},
      {queryName: 'shipments-by-count', doc_type: 'shipment', queryEmit: '[doc.date,doc.from_location_name,doc.to_location_name], doc.total_transactions', reduce: '_sum'}];
    var addQueries = [];
    var addQuery;
    var functionString;
    _.each(querytypes,function(query){
      addQuery = {
        _id: '_design/' + query.queryName,
        views: {}
      };
      addQuery.views[query.queryName] = {};
      functionString = 'function(doc){if (doc.doc_type && doc.doc_type === "strReplaceQueryName"){emit(strReplaceQueryEmit);}}';
      functionString = functionString.replace(/strReplaceQueryEmit/g,query.queryEmit);
      addQuery.views[query.queryName]["map"] = functionString.replace(/strReplaceQueryName/g, query.doc_type);
      addQuery.views[query.queryName]["reduce"] = query.reduce || "_count";
      addQueries.push(addQuery);
    });
    return this.db.bulkDocs(addQueries.concat(this.additionalQueries())).then(function(result){
      var errors = _.filter(result,"error");
      return result;
    }).catch(function(err){
      return err;
    });
  }
}
