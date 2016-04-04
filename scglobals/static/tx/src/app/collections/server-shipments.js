import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import Config from './../models/config';

export default Backbone.Collection.extend({
  url: function () {
    var config = new Config();
    return config.get('djangoUrl') + '/stockchanges.json';
  },
  urlParams: {id: true,ascordesc: 'desc'},
  makeUrlParams: function(params){
    params = params || this.urlParams;
    var str = "?";
    for (var key in params) {
      if (str !== "?") str += "&";
      str += key + "=" + encodeURIComponent(params[key]);
    }
    return str;
  },
  fetch: function(){
    return $.getJSON(this.url() + this.makeUrlParams());
  },
  allShipmentIds: function(){
    var config = new Config();
    return $.getJSON(config.get('djangoUrl') + '/all_shipment_ids.json')
    .then(function(resp){
      return _.flatten(resp);
    });
  }
});
