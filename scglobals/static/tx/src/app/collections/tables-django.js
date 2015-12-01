import _ from 'lodash';
import Backbone from 'backbone';

export default Backbone.Collection.extend({
  makeUrlParams: function(){
    var str = "";
    for (var key in this.urlParams) {
      if (str != "") str += "&";
      str += key + "=" + encodeURIComponent(this.urlParams[key]);
    }
    return str;
  }
  // this was to handle handlebars not displaying null fields... still needed?
  // parse: function(resp, xhr) {
  //   return _.map(resp,function(row){
  //     return _.map(row,function(field){
  //       return (field) ? field : " ";
  //     });
  //   });
  // }
});