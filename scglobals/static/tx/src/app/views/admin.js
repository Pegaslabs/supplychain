import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import db from './../services/db'
import AdminTemplate from './../templates/admin.hbs';
import MigrationView from './migration';
import ServerShipmentsCollection from './../collections/server-shipments.js';

export default Backbone.View.extend({
  template: AdminTemplate,
  totalShipments: 0,
  initialize: function(){
    this.db = new db();
    this.serverShipmentCollection = new ServerShipmentsCollection();
    this.render();
  },
  events:{
    'click .start-migration': 'startMigration'
  },
  startMigration: function(e){
    e.preventDefault();
    this.db.initdb().then(()=>{
      this.serverShipmentCollection.allShipmentIds()
      .then((shipmentIds)=>{
        this.totalShipments = shipmentIds.length;
        this.migrationView = new MigrationView();
        this.migrationView.migrate(shipmentIds)
        .then(()=>{
          this.$el.find('.totalShipments').html(this.totalShipments);
          this.$el.find('.migration-progress').addClass('hidden');
          this.$el.find('.status-complete').removeClass('hidden');
        });
      });
    });
  },
  render: function() {
    this.$el.html(this.template());
    this.$el.find('.status-complete').addClass('hidden');
  }
});
