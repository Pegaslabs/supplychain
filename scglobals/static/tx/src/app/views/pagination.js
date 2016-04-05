import $ from 'jquery';
import Backbone from 'backbone';

import PaginationTemplate from './../templates/pagination.hbs';

export default Backbone.View.extend({
  template: PaginationTemplate,
  initialize: function(obj){
    // TODO: pass in actual limit. temporarily setting here
    obj.limit = obj.limit || 1000;
    obj.skip = Number(obj.skip) || 0;
    this.render(obj);
  },
  render: function(obj) {
    var url = window.location.hash.split("?")[0].split("#/")[1] + "?skip=";
    // is there a next page available?
    if (obj.skip + obj.fetched_rows_length < obj.total_rows_length){
      obj.nextUrl = url + (obj.skip + obj.limit);
    }
    if (obj.skip){
      obj.prevUrl = url + (obj.skip - obj.limit);
    }
    this.$el.html(this.template(obj));
  }
});
