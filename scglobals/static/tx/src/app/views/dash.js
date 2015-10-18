import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import DashTemplate from './../templates/dash.hbs';
import ShipmentsView from './shipments-view'
import LocalDB from './../services/localdb'

export default Backbone.View.extend({

  template: DashTemplate,
  el: '#content',
  initialize: function(){
    this.localDB = new LocalDB("txdb");
  },
  render: function() {
    Backbone.trigger('showLoad',
      "Initializing dash...",
      "Complete!",
      this.localDB.query('scbydate').then((result)=>{
        this.$el.append(new ShipmentsView().render(result));
      }));
    this.$el.empty().append(this.template());
  },
});
