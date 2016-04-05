import _ from 'lodash';
import Backbone from 'backbone';
import DB from './../services/db';
import $ from 'jquery';
import bootstrap from 'bootstrap';

import itemUrl from './../helpers/itemUrl';

import SearchTemplate from './../templates/search.hbs';
import ResultsTemplate from './../templates/search-results.hbs';
import FooterTemplate from './../templates/search-footer.hbs';

export default Backbone.View.extend({
  template: SearchTemplate,
  className: 'search',
  events: {
    'keyup .search-input': 'keyChanged',
    'click .search-drop-item': 'leaveSearch'
  },
  initialize: function(model){
    this.db = new DB();
    this.runSearch(model.get('query'));
    this.model = model;
    this.render();
  },
  render: function() {
    this.$el.html(this.template({id: this.cid, model: this.model.toJSON()}));
    // this.showSearch();
  },
  renderSearch: function(search_query){
    var search_results = this.decorated_results;
    if (search_query){
      search_results = _.filter(this.decorated_results, function(result) {
          return ~result.primary.toLowerCase().indexOf(search_query);
      });
    }
    var displayed = _.take(search_results,15);
    this.$el.find('.search-results').html(ResultsTemplate(displayed));
    this.$el.find('.modal-footer').html(FooterTemplate({
      displayed_length: displayed.length,
      total_length: this.decorated_results.length
    }));
  },
  // TODO search only needs to run once against the server if it's a reduce
  // but then it'll need to refresh when a shipment is added
  runSearch: function(query){
    this.$el.find('.loading-spinner').show();
    this.$el.find('.search-results').empty();
    this.db.query(query,{reduce: true, group: true}).then((results)=>{
      this.$el.find('.loading-spinner').hide();
      var sorted_results = _.sortBy(results.rows, function(r) { return r.value.count; } ).reverse();
      this.decorated_results = _.map(sorted_results,(result)=>{
        var item = result.key;
        if (item.length === 2){
            return {
              primary: item[0],
              secondary: item[1],
              tertiary: result.value.count,
              url: itemUrl(item[0],item[1])
            };
        } else{
          return {background: "", name: "", link: ""};
        }
      });
      this.renderSearch();
    });
  },
  keyChanged: function(e){
    // tab is 9, enter 13, escape 27, 38 arrow up, 40 arrow down
    // TODO: make arrow keys work
    if ([9,27,38,40,13].indexOf(e.keyCode) > -1){
      if (e.keyCode === 27){
          this.leaveSearch();
      }
    } else{
      this.renderSearch(this.$el.find('.search-input').val());
    }
  },
  leaveSearch: function(e){
    this.$el.find('.search-input').val("");
    // TODO: remove this hack & get to work with native bootstrap
    $(".close").click();
    this.renderSearch();
  }
});
