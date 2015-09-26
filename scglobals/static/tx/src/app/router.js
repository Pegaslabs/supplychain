import $ from 'jquery';
import Backbone from 'backbone';
import DashView from './views/dash';
import StatusView from './views/status';

export default Backbone.Router.extend({

  routes: {
    '': 'dashboard',
    'status': 'status'
  },
  dashboard: () => {
    let dashView = new DashView();
    dashView.render();
  },
  status: () => {
    new StatusView().render();
  }

});