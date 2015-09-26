import $ from 'jquery';
import Backbone from 'backbone';
import DashView from './views/dash';
import LoadingView from './views/loading';

export default Backbone.Router.extend({

  routes: {
    '': 'dashboard',
    'loading': 'loading'
  },
  dashboard: () => {
    var dashView = new DashView();
    dashView.render();
  },
  loading: () => {
    new LoadingView().render();
  }

});