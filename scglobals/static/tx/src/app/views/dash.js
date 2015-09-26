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
    $('.dashmain').hide();
    $('.dateSelect').hide();
    let scv = new StockChangesView();
    scv.render({data: $.param(
      {
        startdate: yearStr + "-01-01",
        enddate: (Number(yearStr) + 1) + "-01-01"
      }
    )}).then(function(renderedTpl){
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
    scs.fetch({data: $.param({limit: 1, ascordesc: "asc"})}).then((data) =>{
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
