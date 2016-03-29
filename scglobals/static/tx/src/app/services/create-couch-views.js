import PouchDB from 'pouchdb';

export default class CreateCouchViews {
  constructor(db){
    this.db = db;
    this.couch_views = [
      {
        name: 'shipments-with-value',
        mapFun: function(doc){
          if (doc.doc_type && doc.doc_type === "shipment"){
            emit([doc.from_location_name,doc.date,doc.from_location_name,doc.to_location_name,doc.total_transactions],doc.total_value);
            emit([doc.to_location_name,doc.date,doc.from_location_name,doc.to_location_name,doc.total_transactions],doc.total_value);
          }
        }
      },
      // for stock cards
      {
        name: 'all-transactions',
        mapFun: function(doc){
            if (doc.doc_type && doc.doc_type === "shipment"){
              // in absence of an "OR"-like operator in couchdb queries,
              // using two emits to allow for filtering on both from & to location
              // ordering: item first, then date, then shipment id, then order it was emitted (i),
              // then 0 for "From" and 1 for "To", to determine positive or negative
              // then from or to location for location filtering
              doc.transactions.forEach(function(transaction,i){
                emit([doc.from_location_name,transaction.item_name,transaction.item_category_name,doc.date,doc._id,i,0,transaction.item_lot_expiration,transaction.item_lot_num,doc.from_location_name,doc.to_location_name,transaction.username], -1*transaction.qty);
                emit([doc.to_location_name,transaction.item_name,transaction.item_category_name,doc.date,doc._id,i,1,transaction.item_lot_expiration,transaction.item_lot_num,doc.from_location_name,doc.to_location_name,transaction.username], transaction.qty);
              });
            }
        }
      },
      // for item search http://stackoverflow.com/questions/5456682/return-unique-values-by-key-in-couchdb
      {
        name: 'items-by-name',
        mapFun: function(doc){
            if (doc.doc_type && doc.doc_type === "shipment"){
              doc.transactions.forEach(function(transaction,i){
                emit([transaction.item_name,transaction.item_category_name], 1);
              });
            }
        }
      },
      {
        name: 'locations-by-name',
        mapFun: function(doc){
            if (doc.doc_type && doc.doc_type === "shipment"){
              emit([doc.to_location_type,doc.to_location_name], 1);
              emit([doc.from_location_type,doc.from_location_name], 1);
            }
        }
      }
    ];
  }
  // usage: override reduce property if you need a _sum, default (see below) is count
  create(){
    var view_docs = _.map(this.couch_views,function(couch_view){
      var add_view = {
        _id: '_design/' + couch_view.name,
        views: {}
      };
      add_view.views[couch_view.name] = {
        map: couch_view.mapFun.toString().replace(' mapFun','')
      };
      add_view.views[couch_view.name].reduce = couch_view.reduce || '_stats';
      return add_view;
    });
    return this.db.bulkDocs(view_docs).then(function(result){
      var errors = _.filter(result,"error");
      return result;
    }).catch(function(err){
      return err;
    });
  }
}
