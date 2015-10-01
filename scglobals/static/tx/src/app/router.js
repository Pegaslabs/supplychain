import $ from 'jquery';
import Backbone from 'backbone';
import DashView from './views/dash';
import StatusPageView from './views/status-page';
import HeaderView from './views/header';

export default Backbone.Router.extend({

  routes: {
    '': 'dashboard',
    'status': 'status'
  },
  initialize: () => {
    let headerView = new HeaderView();
    headerView.render();
  },
  dashboard: () => {
    let dashView = new DashView();
    dashView.render();
  },
  status: () => {
    new StatusPageView().render();
  }

});