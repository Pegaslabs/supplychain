import PouchDB from 'pouchdb';

export default class InitialQueries {
  constructor(db){
    this.db = db;
  }
  additionalQueries(){
    var itemsByName = function(doc){
        if (doc.doc_type && doc.doc_type === "shipment"){
          doc.transactions.forEach(function(transaction){
            emit([transaction.item_name,transaction.item_category_name,doc.date,doc.from_location_name,1], transaction.qty);
            emit([transaction.item_name,transaction.item_category_name,doc.date,doc.to_location_name,0], transaction.qty);
          });
        }
    }.toString();
    return [
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
