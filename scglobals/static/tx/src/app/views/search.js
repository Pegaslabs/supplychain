import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DB from './../services/db';

import SearchTemplate from './../templates/search.hbs';
import ResultsTemplate from './../templates/search-results.hbs';

export default Backbone.View.extend({
  template: SearchTemplate,
  resultsTemplate: ResultsTemplate,
  className: 'search',
  events: {
    'focus .search-button': 'showSearch',
    'focusout .search-input': 'hideSearch',
    'keydown .search-input': 'keyChanged'
  },
  initialize: function(query){
    this.db = new DB();
    this.runSearch(query);
    this.render();
  },
  render: function() {
    this.$el.html(this.template());
    // this.showSearch();
  },
  // TODO search only needs to run once against the server if it's a reduce
  // but then it'll need to refresh when a shipment is added
  runSearch: function(query){
    this.$el.find('.loading-spinner').show();
    this.$el.find('.search-results').empty();
    this.db.query(query,{reduce: true, group: true}).then((results)=>{
      this.$el.find('.loading-spinner').hide();
      var decorated_results = _.map(results,(result)=>{
        var item = result.key;
        if (item[0]){
            return {
              primary: item[0],
              secondary: item[1],
              link: item[0] + " " + item[1]
            };
        } else{
          return {background: "", name: "", link: ""};
        }
      });
      this.$el.find('.search-results').html(this.resultsTemplate(decorated_results));
    });
  },
  showSearch: function(){
    this.$el.find('.search').show();
  },
  keyChanged: function(e){
    // tab is 9, enter 13, escape 27, 38 arrow up, 40 arrow down
    if ([9,27,38,40,13].indexOf(e.keyCode) > -1){
      // if (e.keyCode === 9){
      //   e.preventDefault();
      //   if (e.shiftKey)
      //     this.arrowUp();
      //   else
      //     this.arrowDown();
      // }
      if (e.keyCode === 27){
          this.leaveSearch();
      }
        // this.leave();
      // else if (e.keyCode === 38)
        // this.arrowUp();
      // else if (e.keyCode === 40)
        // this.arrowDown();
      // else if (e.keyCode === 13)
        // this.selectItem(this.get('activeIndex'));
    }
  },
  leaveSearch: function(e){
    // focusout
    this.$el.find('.search').hide();
  }
});
