import $ from 'jquery';
import _ from 'lodash';
import SearchView from './search';

export default SearchView.extend({
  runSearch: function(query){
    this.$el.find('.loading-spinner').show();
    this.$el.find('.search-results').empty();
    this.db.query(query,{startkey: ['D'], endkey:['I',{}], reduce: true, group: true}).then((results)=>{
      this.$el.find('.loading-spinner').hide();
      var sorted_results = _.sortBy(results.rows, function(r) { return r.value.count; } ).reverse();
      this.decorated_results = _.map(sorted_results,(result)=>{
        var item = result.key;
        if (item.length === 2){
            return {
              primary: item[1],
              url: ""
            };
        } else{
          return {background: "", name: "", link: ""};
        }
      });
      this.renderSearch();
    });
  },
  leaveSearch: function(e){
    e.preventDefault();
    this.model.get('userSettings').set('location',e.target.innerText.trim());
  }
});
