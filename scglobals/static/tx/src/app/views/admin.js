import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import db from './../services/db'
import AdminTemplate from './../templates/admin.hbs';
import MigrationView from './migration';
import ServerShipmentsCollection from './../collections/server-shipments.js';

export default Backbone.View.extend({
  template: AdminTemplate,
  el: "#container",
  totalShipments: 0,
  initialize: function(){
    this.db = new db();
    this.serverShipmentCollection = new ServerShipmentsCollection();
  },
  events:{
    'click #start-migration': 'startMigration'
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
          $('#totalShipments').html(this.totalShipments);
          $("#migration-progress").hide();
          $("#status-complete").show();
        });
      });
    });
  },
  render: function() {
    this.$el.html(this.template());
    $("#status-complete").hide();
    $("#clearing-db").hide();
  }
});
