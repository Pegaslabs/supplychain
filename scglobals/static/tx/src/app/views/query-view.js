import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DefaultQueryModel from './../models/default-query';

import QueryViewTemplate from './../templates/query-view.hbs';
import QueryDetailsTemplate from './../templates/query-details.hbs';
import QueryTableTemplate from './../templates/query-table.hbs';
import PaginationView from './pagination';

// have to run two queries when (1) filtering on startkey & endkey (2) looking for a sum
// (1) is because we wouldn't know the number of available rows for pagination
// (total_rows is all rows including those that don't match filter)

export default Backbone.View.extend({
  template: QueryViewTemplate,
  tableTemplate: QueryTableTemplate,
  initialize: function(){
    this.title = this.model.get('title') || this.model.get('query');
    this.render();
  },
  render: function() {
    this.$el.html(this.template({title: this.title}));
    this.model.fetch().then((results)=>{
      this.renderTable();
      // if there's no key filtering, total_rows will be an accurate reflection
      // of rows for pagination  (but if sum is needed, we have to run the reduce query anyways)
      if (!this.model.get('startkey') && !this.model.get('include_sum')){
        this.renderDetails({
          fetched_rows_length: this.model.get('results').rows.length,
          total_rows_length: this.model.get('results').total_rows,
          skip: this.model.get('skip')
        });
      } else{
        this.reduce_model = new DefaultQueryModel(this.model.toJSON());
        this.reduce_model.set('reduce',true);
        this.reduce_model.fetch().then(()=>{
          var sum, count = 0;
          if (this.reduce_model.get('results').rows[0]){
            sum = this.reduce_model.get('results').rows[0].value.sum;
            count = this.reduce_model.get('results').rows[0].value.count;
          }
          this.renderDetails({
            fetched_rows_length: this.model.get('results').rows.length,
            total_rows_length: count,
            skip: this.model.get('skip'),
            sum: sum
          });
        });
      }
    });
  },
  renderDetails: function(obj){
    this.$el.find('.details').html(QueryDetailsTemplate(obj))
    .append(new PaginationView(obj).$el);
  },
  renderTable: function(){
    var map_fun, headers;
    // hacky rendering of first emit statement in query, second emits won't be displayed in the header
    // renderTable is expected to be overwritten
    if (this.model.get('results').rows[0]){
      map_fun= _.find(this.model.db.createCouchViews.couch_views,{name: this.model.get('query')}).mapFun.toString();
      if (map_fun && (map_fun.indexOf("[") !== -1) && (map_fun.indexOf("]" !== -1))){
          headers = map_fun.substring(map_fun.indexOf("[")+1,map_fun.indexOf("]")).split(",");
      }
      this.$el.find('.results-table').html(this.tableTemplate({
        headers: headers,
        results: this.model.get('results').rows
      }));
    }
  }
});
