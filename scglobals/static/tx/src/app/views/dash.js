import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import DashTemplate from './../templates/dash.hbs';
import ShipmentsSummaryTemplate from './../templates/shipments-summary.hbs';
import ShipmentsTemplate from './../templates/shipments.hbs';
import QueryView from './views/query-view';

export default QueryView.extend({
  shipmentsTemplate: ShipmentsTemplate,
  initialize: function(options,userSettings){
    this.userSettings = userSettings;
    this.render(options);
  },
  render: function(options) {
    options = options || {};
    options.query = 'shipments-with-value';
    options.startkey = [this.userSettings.get('location'),{}];
    options.endkey = [this.userSettings.get('location')];
    var queryView = new QueryView({model: new DefaultQueryModel(options)});
    queryView.tableTemplate =
    this.$el.html(this.template());
  }
});
