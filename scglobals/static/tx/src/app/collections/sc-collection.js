import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

export default Backbone.Collection.extend({
  url: function () {
    return 'http://localhost:8000/stockchanges.json?startdate=' 
      + this.startdate + '&enddate=' + this.enddate + '&limit=' + this.limit
  },
  parse: function(resp, xhr) {
   return _.map(resp,function(row){
      return _.map(row,function(field){
        return (field) ? field : " ";
      });
    });
  },
  startdate: '2015-09-10',
  enddate: '2015-09-11',
  limit:100
});