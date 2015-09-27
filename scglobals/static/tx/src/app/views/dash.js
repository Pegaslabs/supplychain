import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import DashTemplate from './../templates/dash-tpls.hbs';
import TransactionsView from './transactions-view'
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
      this.localDB.query('scbymodified').then((result)=>{
        this.$el.append(new TransactionsView().render(result)); 
      }));
    this.$el.empty().append(this.template());
  },
});
