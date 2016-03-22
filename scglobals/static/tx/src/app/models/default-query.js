import Backbone from 'backbone';
import DB from './../services/db';

export default Backbone.Model.extend({
  initialize: function(){
    this.db = new DB();
  },
  defaults: function () {
    return {
      location: 'Central Warehouse'
    };
  }
});
