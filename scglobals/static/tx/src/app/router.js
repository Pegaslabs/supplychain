import $ from 'jquery';
import Backbone from 'backbone';
import DashView from './views/dash'
import StockChangesView from './views/sc-view'

export default Backbone.Router.extend({

  routes: {
    '': 'dashboard'
  },

  dashboard: () => {
    var scsView = new StockChangesView();
    scsView.render().then(function(renderedTpl){
      $('#content').empty().append(renderedTpl);
    });
  }

});