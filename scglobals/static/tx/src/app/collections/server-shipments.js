import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DjangoServerCollection from './django-server-collection.js';

export default DjangoServerCollection.extend({
  url: function () {
    return 'http://localhost:8000/stockchanges.json';
  },
  urlParams: {id: true,ascordesc: 'desc'},
  fetch: function(){
    return $.getJSON(this.url() + this.makeUrlParams());
  },
  allShipmentIds: function(){
    return $.getJSON('http://localhost:8000/all_shipment_ids.json')
    .then(function(resp){
      return _.flatten(resp);
    });
  }
});