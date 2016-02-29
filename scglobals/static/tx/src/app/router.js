import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DashView from './views/dash';
import HeaderView from './views/header';
import AdminView from './views/admin';
import ShipmentView from './views/shipment';
import ItemView from './views/item';
import Config from './services/config';

export default Backbone.Router.extend({

  routes: {
    '': 'dashboardRoute',
    '/:options': 'dashboardRoute',
    'admin': 'adminRoute',
    'shipment/:id': 'shipmentRoute',
    'item/:id': 'itemRoute'
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
    $('.supplychain').append(headerView.$el);
  },

  adminRoute: function(){
    this.switchView(new AdminView());
  },
  dashboardRoute: function(urlOptions) {
    this.switchView(new DashView(this._urlParamsToObject(urlOptions)));
  },
  shipmentRoute: function(shipmentId){
    this.switchView(new ShipmentView(shipmentId));
  },
  itemRoute: function(id){
    this.switchView(new ItemView(id));
  },

  switchView: function(newView) {
    if (this.mainView) {
      this.mainView.remove();
    }
    this.mainView = (newView);
    $('.container').append(newView.$el);
  }

});
