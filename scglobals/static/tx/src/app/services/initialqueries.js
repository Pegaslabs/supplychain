import PouchDB from 'pouchdb';

export default class InitialQueries {
  constructor(db){
    this.db = db;
  }
  saveDefaultQueries(){
    let querytypes = [
      // for actual transactions
      {queryName: 'shipmentsbydate', doc_type: 'shipment', queryEmit: 'doc.date'}];
      // for sum of total value (when working, use sum & skip "count" of transactions)
      // {queryName: 'scbyvalue', doc_type: 'transaction', queryEmit: 'doc.id,doc.total_value', reduce: '_sum'},
      // for server syncing
      // {queryName: 'scbyid', doc_type: 'transaction', queryEmit: 'doc.stockchange_id'},
      // {queryName: 'scbymodified', doc_type: 'transaction', queryEmit: 'doc.modified'}];
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
    return this.db.bulkDocs(addQueries).then(function(result){
      var errors = _.filter(result,"error");
      return result;
    }).catch(function(err){
      return err;
    });
  }
}