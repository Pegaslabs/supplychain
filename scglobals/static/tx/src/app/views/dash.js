import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import DashTemplate from './../templates/dash-tpls.hbs';
import StockChangesView from './sc-view'
import StockChangeCollection from './../collections/sc-collection';

export default Backbone.View.extend({

  template: DashTemplate,
  el: '#content',
  initialize: function(){
    this.loading = false;
  },
  doSearch: function(yearStr){
    this.$el.empty().append(this.template({"title":yearStr,  buttons: this.buttons}));
    $('.fa-spinner').fadeIn();
    $('.dashmain').hide();
    $('.dateSelect').hide();
    let scv = new StockChangesView();
    scv.collection.startdate = yearStr + "-01-01";
    scv.collection.enddate = (Number(yearStr) + 1) + "-01-01";
    scv.collection.limit = 0;
    scv.render().then(function(renderedTpl){
      $('.fa-spinner').fadeOut(200);
      $('.dashmain').empty().append(renderedTpl);
      $('.dashmain').fadeIn(800);
    });
  },
  showButtons: () => {
    $('.dateSelect').toggle();
  },
  events: {
    "click .btn": "triggerDoSearch",
    "click .showButtons": "showButtons"
  },
  triggerDoSearch: function(event){
    this.doSearch($(event.currentTarget).text());
  },
  render: function() {
    // get earliest stock change to make buttons
    let scs = new StockChangeCollection();
    scs.startdate = null;
    scs.enddate = null;
    scs.limit = 1;
    scs.ascordesc = 'asc';
    scs.fetch().then((data) =>{
      let floorYear = data[0][0].split("-")[0];
      let counter = floorYear;
      let ceilingYear = new Date().getFullYear();
      let buttons = [];
      while (counter <= ceilingYear) {
        buttons.push(counter)
        counter++;
      }
      this.buttons = buttons;
      this.doSearch(floorYear);
    });
  },
});
