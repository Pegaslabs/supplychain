import Backbone from 'backbone';
import DB from './../services/db';

export default Backbone.Model.extend({
  initialize: function(){
    this.db = new DB();
  },
  defaults: function () {
    return {
      created: new Date(),
      updated: new Date(),
      creator: '',
      updated_by: ''
    };
  },
  fetch: function(){
    return this.db.get(this.id).then((results)=>{
      console.log(results);
      return this.set(results);
    });
  }
});