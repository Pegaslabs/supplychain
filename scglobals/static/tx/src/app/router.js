import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DashView from './views/dash';
import HeaderView from './views/header';
import AdminView from './views/admin';
import Config from './services/config';

export default Backbone.Router.extend({

  routes: {
    '': 'dashboard',
    'admin': 'admin'
  },
  initialize: function() {
    this.config = new Config();
    let headerView = new HeaderView();
    $('#supplychain').append(headerView.render());
    $('#supplychain').append("<div id='container'></div>");
  },
  dashboard: () => {
    let dashView = new DashView();
    dashView.render();
  },
  admin: () => {
    new AdminView().render();
  },

});