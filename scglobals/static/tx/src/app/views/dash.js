import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import DashTemplate from './../templates/dash-tpls.hbs';
// import StockChangesView from './sc-view'
import StockChangeCollection from './../collections/sc-collection';

export default Backbone.View.extend({

  template: DashTemplate,
  el: '#content',
  render: function() {
    this.$el.empty().append(this.template());
  },
});
