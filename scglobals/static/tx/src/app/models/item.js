import Backbone from 'backbone';
import TablesDefaultModel from './tables-default';

export default TablesDefaultModel.extend({
  defaults: {
    name: null
  },
  fetch: function(){
    var options = {
      startkey: [this.get('name'),this.get('category'),{},{},{}],
      endkey: [this.get('name'),this.get('category')],
      reduce: false,
      descending: true,
      limit: 1000
    };
    return this.db.query('all-transactions',options);
  }
});
