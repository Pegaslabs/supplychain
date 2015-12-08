import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import MigrationService from './../services/migrate';
import MigrationProgress from './../templates/migration-progress.hbs';

export default Backbone.View.extend({
  template: MigrationProgress,
  el: "#migration-progress",
  pct:0,
  totalShipments:0,
  initialize: function(){
    Backbone.on('MigrationProgress',this.render);
  },
  render: function(offset){
    this.pct = (offset / this.totalShipments)*100;
    this.$el.html(this.template({pct: this.pct, totalShipments: this.totalShipments}));
  },
  migrate: function(shipmentIds) {
    this.migrationService = new MigrationService(shipmentIds);
    this.totalShipments = shipmentIds.length;
    this.render(0);
    return this.migrationService.start();
  }
});
