import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DB from './../services/db';

export default Backbone.Collection.extend({
  initialize: function(){
    this.db = new DB();
  },
  save: function(){
    return this.db.bulkDocs(this.toJSON());
  }
  convertFromTransactions: function(){
    // debugger;
  }
});