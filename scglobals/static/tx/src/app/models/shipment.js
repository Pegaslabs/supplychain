import Backbone from 'backbone';
import TablesDefaultModel from './tables-default';

export default TablesDefaultModel.extend({
  defaults: {
    transactions: []
  }
});