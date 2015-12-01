import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import TableServerCollection from './table-server-collection';

export default TableServerCollection.extend({
  url: function () {
    return this.url + 'stockchanges.json/'
  }
  urlOptions: {
    "limit": 100
  }
});