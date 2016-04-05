import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import ShipmentsTemplate from './../templates/shipments.hbs';
import QueryView from './query-view';
import DefaultQueryModel from './../models/default-query';

export default QueryView.extend({
  initialize: function(options,userSettings){
    options = options || {};
    options.startkey = [userSettings.get('location'),{}];
    options.endkey = [userSettings.get('location')];
    options.query = 'shipments-with-value';
    options.include_sum = false;
    options.include_docs = false;
    options.limit = 100;
    options.title = "Shipments: " + userSettings.get('location');
    this.model = new DefaultQueryModel(options);
    this.render();
  },
  renderTable: function(){
    this.$el.find('.results-table').html(ShipmentsTemplate(this.model.get('results').rows));
  }
});
