import Backbone from 'backbone';
import TablesDefaultModel from './tables-default';

export default TablesDefaultModel.extend({
  defaults: {
    from_location: "",
    to_location: "",
    date: "",
    vendor_id: "",
    transactions: []
  }
});