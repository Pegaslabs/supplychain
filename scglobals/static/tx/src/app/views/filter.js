import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import FilterTemplate from './../templates/filter.hbs';
import DateFilterCollection from './../collections/date-filters';

export default Backbone.View.extend({
  template: FilterTemplate,
  startkey: [{},{},{}],
  endkey: [{},{},{}],
  el: "#container",
  events:{
    'click .date_filter': 'dateFilter'
  },
  initialize: function(){
    this.dateFilterCollection = new DateFilterCollection();
  },
  _filterDates: function(date_filter){
    this.startkey[0] = date_filter.get('startdate');
    this.endkey[0] = date_filter.get('enddate');
  },
  dateFilter: function(event){
    $('.date_filters').toggle();
    $("." + event.target.id).show();
    this._filterDates(this.dateFilterCollection.get(event.target.id));
    $('#result').html(JSON.stringify([this.startkey,this.endkey]));
  },
  render: function(options) {
    this.$el.html(this.template(this.dateFilterCollection.toJSON()));
  }
});
