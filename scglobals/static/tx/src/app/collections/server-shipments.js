import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import ServerCollection from './server-collection.js';

export default ServerCollection.extend({
  url: function () {
    return 'http://localhost:8000/shipments.json';
  }
});