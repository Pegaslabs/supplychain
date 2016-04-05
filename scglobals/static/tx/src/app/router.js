import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import ShipmentsView from './views/shipments';
import HeaderView from './views/header';
import AdminView from './views/admin';
import ShipmentView from './views/shipment';
import InventoryView from './views/inventory';
import ItemView from './views/item';
import QueryView from './views/query-view';
import LoginView from './views/login';
import LogOutView from './views/logout';
import DefaultQueryModel from './models/default-query';
import UserSettingsModel from './models/user-settings';
import DB from './services/db';

export default Backbone.Router.extend({

  routes: {
    '': 'shipmentsRoute',
    '/:options': 'shipmentsRoute',
    'inventory': 'inventoryRoute',
    'admin': 'adminRoute',
    'shipment/:id': 'shipmentRoute',
    'item/:category/:itemName': 'itemRoute',
    'login': 'login',
    'logout': 'logout'
  },
  _urlParamsToObject: function(queryParams){
    if (!queryParams) return;
    return _.reduce(queryParams.split("&"),function(result,option){
      result[option.split("=")[0]] = option.split("=")[1];
      return result;
    },{});
  },
  initialize: function() {
    this.userSettings = new UserSettingsModel();
    this.headerView = new HeaderView(this.userSettings);
    $('.supplychain').append(this.headerView.$el);
    this.db = new DB();
  },
  inventoryRoute: function(urlOptions){
    this.switchView(new InventoryView(this._urlParamsToObject(urlOptions),this.userSettings));
  },
  adminRoute: function(){
    this.switchView(new AdminView());
  },
  shipmentsRoute: function(urlOptions) {
    this.switchView(new ShipmentsView(this._urlParamsToObject(urlOptions),this.userSettings));
  },
  shipmentRoute: function(shipmentId){
    this.switchView(new ShipmentView(shipmentId));
  },
  itemRoute: function(category,itemName,urlOptions){
    this.switchView(new ItemView(this.userSettings,category,itemName,this._urlParamsToObject(urlOptions)));
  },
  login: function(){
    this.switchView(new LoginView());
    $('.username').focus();
  },
  logout: function(){
    this.switchView(new LogOutView());
  },
  // queryRoute: function(url_params){
  //   var options = this._urlParamsToObject(url_params);
  //   var query_model_options = options || {};
  //   query_model_options.query = 'all-transactions';
  //   this.switchView(new QueryView({model: new DefaultQueryModel(query_model_options)}));
  // },
  switchView: function(newView) {
    if (this.mainView) {
      this.mainView.remove();
    }
    this.db.checkAuthentication().then((isAuthenticated)=>{
      if (!isAuthenticated){
        this.mainView = new LoginView();
      } else{
        this.mainView = newView;
      }
      $('.container').append(this.mainView.$el);
      this.mainView.$el.find(this.mainView.focusEl).focus();
    });
  }

});
