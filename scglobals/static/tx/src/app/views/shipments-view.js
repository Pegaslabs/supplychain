import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import ShipmentsTemplate from './../templates/shipments.hbs';
import ShipmentsCollection from './../collections/shipments';
import LoadingView from './loading';

export default Backbone.View.extend({

  template: ShipmentsTemplate,
  shipments: [],
  events:{
    'click .dropdown-toggle': 'toggleTransactions',
  },
  initialize: function(){
    this.loadingView = new LoadingView();
    this.shipmentsCollection = new ShipmentsCollection();
  },
  render: function(transactions) {
    // this.$el.
    // this.loading();
    // this.shipmentsCollection.fetch().then((shipments)=>{

    // });
    return this.$el.html(this.template({shipments: this.shipments}));
  },
});
