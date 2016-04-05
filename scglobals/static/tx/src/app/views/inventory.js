import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import moment from 'moment';

import InventoryTemplate from './../templates/inventory.hbs';
import InventoryTableTemplate from './../templates/inventory-table.hbs';
import DefaultQueryModel from './../models/default-query';

export default Backbone.View.extend({
  events: {
    'click .inventory-nav': 'filter'
  },
  initialize: function(options,userSettings){
    this.title = "Inventory at " + userSettings.get('location');
    options = options || {};
    options.startkey = [userSettings.get('location'),{}];
    options.endkey = [userSettings.get('location')];
    options.query = 'inventory';
    options.reduce = true;
    options.group_level = 5;
    this.model = new DefaultQueryModel(options);
    this.render();
    this.model.fetch().then(()=>{
      this.model.set('inventoryResults',_.filter(this.model.get('results').rows, function(result) {
         return result.value.sum > 0;
       }));
      this.model.set('qualityResults',_.filter(this.model.get('results').rows, function(result) {
         return result.value.sum < 0;
       }));
      this.model.set('expiringResults',_.filter(this.model.get('inventoryResults'), function(result) {
        var m = moment(result.key[3]);
        if (!m.isValid()) return false;
        return m.isSameOrBefore(moment().add(6, 'months'));
      }));
      this.model.set('expiringResults',_.sortBy(this.model.get('expiringResults'),function(r){
        return r.key[3];
      }));
      var oooListResults = _.reduce(this.model.get('results').rows, function(oooList,result) {
        if (result.value.sum === 0){
          oooList[result.key[0] + result.key[1]] = result;
        } else{
          delete oooList[result.key[0] + result.key[1]];
        }
        return oooList;
      },{});
      this.model.set('oostockResults',_.map(oooListResults,function(result,key,val){
        // remove expiration & lot as it makes no sense at item level
        result.key[3] = "";
        result.key[4] = "";
        return result;
      }));
      this.model.set('showResults',this.model.get('inventoryResults'));
      this.model.set('inventory',true);
      this.renderTable();
    });
  },
  // this could be a lot lot more pretty
  filter: function(e){
    this.model.set('inventory',false);
    this.model.set('expiring',false);
    this.model.set('quality',false);
    this.model.set('oostock',false);
    this.model.set(e.target.id,true);
    this.model.set('showResults',this.model.get(e.target.id + "Results"));
    this.renderTable();
  },
  render: function(){
    this.$el.html(InventoryTemplate(this.title));
  },
  renderTable: function(){
    this.$el.find('.results-table').html(InventoryTableTemplate(this.model.toJSON()));
  }
});
