import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DashView from './views/dash';
import HeaderView from './views/header';
import AdminView from './views/admin';
import ShipmentView from './views/shipment';
import ItemView from './views/item';
import QueryView from './views/query-view';
import DefaultQueryModel from './models/default-query';
import Config from './services/config';
import UserSettingsModel from './models/user-settings';

export default Backbone.Router.extend({

  routes: {
    '': 'dashboardRoute',
    '/:options': 'dashboardRoute',
    'admin': 'adminRoute',
    'query/:options': 'queryRoute',
    'shipment/:id': 'shipmentRoute',
    'item/:category/:itemName': 'itemRoute'
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
    this.userSettings = new UserSettingsModel();
    this.headerView = new HeaderView(this.userSettings);
    $('.supplychain').append(this.headerView.$el);
  },

  adminRoute: function(){
    this.switchView(new AdminView());
  },
  dashboardRoute: function(urlOptions) {
    this.switchView(new DashView(this._urlParamsToObject(urlOptions),this.userSettings));
  },
  shipmentRoute: function(shipmentId){
    this.switchView(new ShipmentView(shipmentId));
  },
  itemRoute: function(category,itemName){
    this.switchView(new ItemView(this.userSettings,category,itemName));
  },
  queryRoute: function(options){
    this.switchView(new QueryView({model: new DefaultQueryModel({'query': 'shipments-with-value'})}));
  },
  switchView: function(newView) {
    if (this.mainView) {
      this.mainView.remove();
    }
    this.mainView = (newView);
    $('.container').append(newView.$el);
  }

});
