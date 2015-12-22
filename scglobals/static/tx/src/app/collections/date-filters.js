import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import Moment from 'moment';

import FiltersCollection from './filters.js';

export default FiltersCollection.extend({
  initialize: function(){
    this.set([
    {
      id: '0_filter_pastweek',
      name: 'past week',
      startdate:Moment().subtract(1,'weeks').toISOString().split('T')[0],
      enddate:(new Date()).toISOString().split('T')[0]
    },
    {
      id: '0_filter_pastmonth',
      name: 'past month',
      startdate:Moment().subtract(1,'month').toISOString().split('T')[0],
      enddate:(new Date()).toISOString().split('T')[0]
    },
    {
      id: '0_filter_past6months',
      name: 'past 6 months',
      startdate:Moment().subtract(6,'months').toISOString().split('T')[0],
      enddate:(new Date()).toISOString().split('T')[0]
    },
    {
      id: '0_filter_pastyear',
      name: 'past year',
      startdate:Moment().subtract(1,'year').toISOString().split('T')[0],
      enddate:(new Date()).toISOString().split('T')[0]
    },
    {
      id: '0_filter_yeartodate',
      name: 'year to date',
      startdate:Moment().startOf('year').toISOString().split('T')[0],
      enddate:(new Date()).toISOString().split('T')[0]
    },
    {
      id: '0_filter_lastyear',
      name: 'last year',
      startdate: Moment().startOf('year').subtract(1,'year').toISOString().split('T')[0],
      enddate: Moment().endOf('year').subtract(1,'year').toISOString().split('T')[0],
    },
    {
      id: '0_filter_chooserange',
      name: 'choose range',
      startdate: null,
      enddate: null,
    }
    ]);
  }
});