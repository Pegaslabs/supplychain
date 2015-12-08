import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DB from './../services/db';
import ShipmentModel from './../models/shipment';

export default Backbone.Collection.extend({
  model: ShipmentModel,
  initialize: function(){
    this.db = new DB();
  },
  save: function(){
    return this.db.bulkDocs(this.toJSON());
  },
});