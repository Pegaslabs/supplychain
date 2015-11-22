import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import LocalDB from './../services/localdb';

export default Backbone.Collection.extend({
  initialize: function(){
    this.localDB = new LocalDB();
  },
  save: function(){
    return this.db.bulkDocs(this.toJSON());
  }
  convertFromTransactions: function(){
    // debugger;
  }
});