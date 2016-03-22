import _ from 'lodash';
import Backbone from 'backbone';

export default Backbone.Collection.extend({
  makeUrlParams: function(params){
    params = params || this.urlParams;
    var str = "?";
    for (var key in params) {
      if (str !== "?") str += "&";
      str += key + "=" + encodeURIComponent(params[key]);
    }
    return str;
  },
  makeNextUrlParams: function(options){
    var next_options = _.clone(options) || {};
    var limit = next_options.limit || 1000;
    if (next_options.skip){
      next_options.skip = Number(options.skip) + limit;
    }
    else {
     next_options.skip = limit;
    }
    return this.makeUrlParams(next_options);
  },
  makePreviousUrlParams: function(options){
    var next_options = _.clone(options) || {};
    var limit = next_options.limit || 1000;
    if (next_options.skip){
      next_options.skip = Number(options.skip) - limit;
    }
    else {
     next_options.skip = 0;
    }
    return this.makeUrlParams(next_options);
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
