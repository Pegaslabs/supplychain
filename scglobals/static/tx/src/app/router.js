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
    $('body').append('<div id="js-app"></div>');
    let headerView = new HeaderView();
    headerView.render();
  },
  dashboard: () => {
    let dashView = new DashView();
    dashView.render();
  },
  status: () => {
    new StatusPageView().render();
  },

});