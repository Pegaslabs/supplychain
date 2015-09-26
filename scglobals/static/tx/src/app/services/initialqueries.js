import PouchDB from 'pouchdb';

export default class InitialQueries {
  constructor(db){
    this.db = db;
  }
  saveDefaultQueries(){
    let querytypes = [
      {queryName: 'scbymodified', doc_type: 'transaction', queryEmit: '[doc.modified]'}];
    // to add default queries, add to this list:
    // {queryName: 'item', queryEmit: '[doc.name,doc.itemCategory.name,doc.created,doc.updated]'}];
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
      addQuery.views[query.queryName]["reduce"] = "_count";
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