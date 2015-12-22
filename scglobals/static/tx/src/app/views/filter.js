import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import dateFormat from './../helpers/dateFormat';
import Moment from 'moment';
import FilterTemplate from './../templates/filter.hbs';
import DateFilterCollection from './../collections/date-filters';

export default Backbone.View.extend({
  template: FilterTemplate,
  startkey: [{},{},{}],
  endkey: [{},{},{}],
  currentDateFilter: null,
  events:{
    'click .date_filter': 'dateFilter',
    'click #filter-toggle': 'toggleFilter',
    "click #dates-chosen": 'filterOnRange'
  },
  initialize: function(){
    this.dateFilterCollection = new DateFilterCollection();
  },
  _getKeys: function(){
    // on the fence issues...
    var startdate = Moment(this.currentDateFilter.get('startdate')).subtract(1,'days').format('YYYY-MM-DD');
    this.startkey[0] = startdate;
    this.endkey[0] = this.currentDateFilter.get('enddate') + "{}";
    return {startkey: this.startkey, endkey: this.endkey};
  },
  _triggerFilter: function(){
    
    Backbone.trigger('FilterUpdated',this._getKeys(),this._getDescription());
  },
  dateFilter: function(event){
    $('.date_filters').toggle();
    $("." + event.target.id).show();
    if (!this.currentDateFilter){
      this.currentDateFilter = this.dateFilterCollection.get(event.target.id);
      if (this.currentDateFilter.get('id') === '0_filter_chooserange'){
        $("#select-dates").removeClass('hidden');
      }
      else{
        this._triggerFilter();
      }
    }
    else{
      $("#select-dates").addClass('hidden');
      this.currentDateFilter = null;
      Backbone.trigger('FilterUpdated',"","");
    }
  },
  filterOnRange: function(){
    var startdate = $("#startdate").val();
    var enddate = $("#enddate").val();
    $(".start-date-group").removeClass('has-error');
    $(".end-date-group").removeClass('has-error');
    if (!Moment(startdate).isValid()){
     $(".start-date-group").addClass('has-error');
    }
    else if (!Moment(enddate).isValid()) {
     $(".end-date-group").addClass('has-error');
    }
    else{
      this.currentDateFilter.set('startdate',Moment(startdate).format('YYYY-MM-DD'));
      this.currentDateFilter.set('enddate',Moment(enddate).format('YYYY-MM-DD'));
      this._triggerFilter()
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
