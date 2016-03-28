import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

export default Backbone.Collection.extend({
  url: function () {
    return 'http://localhost:8000/stockchanges.json';
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
    return $.getJSON('http://localhost:8000/all_shipment_ids.json')
    .then(function(resp){
      return _.flatten(resp);
    });
  }
});
