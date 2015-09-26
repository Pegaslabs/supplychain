import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

export default Backbone.Collection.extend({
  url: function () {
    return 'http://localhost:8000/stockchanges.json';
  },
  parse: function(resp, xhr) {
    console.log('asdf',resp);
    return _.map(resp,function(row){
      return _.map(row,function(field){
        return (field) ? field : " ";
      });
    });
  }
});