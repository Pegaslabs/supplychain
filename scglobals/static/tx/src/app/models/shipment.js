import Backbone from 'backbone';
import DefaultDocModel from './default-doc';

export default DefaultDocModel.extend({
  defaults: function () {
    return {
      // location: 'Central Warehouse'
    };
  }
});
