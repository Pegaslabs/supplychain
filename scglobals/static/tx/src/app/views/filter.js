import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import dateFormat from './../helpers/dateFormat';

import FilterTemplate from './../templates/filter.hbs';
import DateFilterCollection from './../collections/date-filters';

export default Backbone.View.extend({
  template: FilterTemplate,
  startkey: [{},{},{}],
  endkey: [{},{},{}],
  currentDateFilter: null,
  events:{
    'click .date_filter': 'dateFilter',
    'click #filter-toggle': 'toggleFilter'
  },
  initialize: function(){
    this.dateFilterCollection = new DateFilterCollection();
  },
  _filterDates: function(date_filter){
    this.startkey[0] = date_filter.get('startdate');
    this.endkey[0] = date_filter.get('enddate') + "{}";
  },
  _getFilters: function(){
    return {startkey: this.startkey, endkey: this.endkey};
  },
  dateFilter: function(event){
    $('.date_filters').toggle();
    $("." + event.target.id).show();
    if (!this.currentDateFilter){
      this.currentDateFilter = this.dateFilterCollection.get(event.target.id);
      this._filterDates(this.dateFilterCollection.get(event.target.id));
      Backbone.trigger('FilterUpdated',this._getFilters(),this._getDescription());
    }
    else{
      this.currentDateFilter = null;
      Backbone.trigger('FilterUpdated',"","");
    }
  },
  _getDescription: function(){
    return dateFormat(this.currentDateFilter.get('startdate')) + " - " +
      dateFormat(this.currentDateFilter.get('enddate'));
  },
  toggleFilter: function(){
    $("#show-filters").toggleClass('hidden');
  },
  render: function(options) {
    this.$el.html(this.template(this.dateFilterCollection.toJSON()));
  }
});
