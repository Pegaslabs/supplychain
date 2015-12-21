import PouchDB from 'pouchdb';

export default class InitialQueries {
  constructor(db){
    this.db = db;
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
    return this.db.bulkDocs(addQueries).then(function(result){
      var errors = _.filter(result,"error");
      return result;
    }).catch(function(err){
      return err;
    });
  }
}