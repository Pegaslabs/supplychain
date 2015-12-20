import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DashView from './views/dash';
import HeaderView from './views/header';
import AdminView from './views/admin';
import ShipmentView from './views/shipment';
import FilterView from './views/filter';
import Config from './services/config';

export default Backbone.Router.extend({

  routes: {
    '': 'dashboard',
    '/:options': 'dashboard',
    'admin': 'admin',
    'shipment/:id': 'shipment',
    'filter/:options': 'filter'
  },
  _urlParamsToObject: function(queryParams){
    if (!queryParams) return;
    return _.reduce(queryParams.split("&"),function(result,option){
      result[option.split("=")[0]] = option.split("=")[1];
      return result;
    },{});
  },
  initialize: function() {
    this.config = new Config();
    let headerView = new HeaderView();
    $('#supplychain').append(headerView.render());
    $('#supplychain').append("<div id='container'></div>");
    this.dashView = new DashView();
  },
  dashboard: function(urlOptions) {
    this.dashView.render(this._urlParamsToObject(urlOptions));
  },
  admin: () => {
    new AdminView().render();
  },
  shipment: (id) => {
    new ShipmentView(id).render();
  },
  filter: (options) => {
    new FilterView().render(options);
  },

});