import Backbone from 'backbone';
import DefaultDocModel from './default-doc';

export default DefaultDocModel.extend({
  defaults: function () {
    return {
      location: 'Central Warehouse'
    };
  },
  initialize: function(){
    this.fetch();
    this.on('change', this.save, this);
  },
  fetch: function(){
    var local_cache = JSON.parse(localStorage.getItem('supplyChainUserSettings'));
    if (local_cache) this.set(local_cache);
  },
  save: function(){
    localStorage.setItem('supplyChainUserSettings', JSON.stringify(this.toJSON()));
    window.location.reload();
  }
});
