import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import ShipmentTemplate from './../templates/shipment.hbs';
import ShipmentModel from './../models/shipment.js';
import Config from './../services/config.js';

export default Backbone.View.extend({

  template: ShipmentTemplate,
  el: '#container',
  initialize: function(id){
    this.config = new Config();
    this.model = new ShipmentModel({id: id});
  },
  render: function(transactions) {
    this.model.fetch().then(()=>{
      this.$el.html(this.template({shipment: this.model.toJSON(), djangoUrl: this.config.djangoUrl}));
    });
  },
});
