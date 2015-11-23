import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DashView from './views/dash';
import StatusPageView from './views/status-page';
import HeaderView from './views/header';
import Config from './services/config';

export default Backbone.Router.extend({

  routes: {
    '': 'dashboard',
    'status': 'status'
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
  status: () => {
    new StatusPageView().render();
  },

});