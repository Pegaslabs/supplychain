import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

export default Backbone.Collection.extend({
  url: function () {
    var url = 'http://localhost:8000/stockchanges.json?';
    if (this.startdate) url += "&startdate=" + this.startdate;
    if (this.enddate) url += "&enddate=" + this.enddate;
    if (this.limit) url += "&limit=" + this.limit;
    if (this.ascordesc) url += "&ascordesc=" + this.ascordesc;
    return url;
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
  limit:1000,
  ascordesc: "ASC"
});