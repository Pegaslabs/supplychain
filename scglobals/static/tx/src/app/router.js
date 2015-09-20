import $ from 'jquery';
import Backbone from 'backbone';
import DashView from './views/dash'

export default Backbone.Router.extend({

  routes: {
    '': 'dashboard'
  },

  dashboard: () => {
  	var dashView = new DashView();
  	dashView.render();
  }

});