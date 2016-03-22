import Backbone from 'backbone';
import DefaultQueryModel from './default-query';

export default DefaultQueryModel.extend({
  defaults: {
    name: null,
    category: null
  },
  fetch: function(){
    var options = {
      startkey: [this.get('location'),this.get('name'),this.get('category'),{}],
      endkey: [this.get('location'),this.get('name'),this.get('category')],
      reduce: false,
      descending: true,
      limit: 1000
    };
    return this.db.query('all-transactions',options);
  }
});
