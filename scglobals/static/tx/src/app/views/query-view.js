import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DefaultQueryModel from './../models/default-query';

import QueryViewTemplate from './../templates/query-view.hbs';
import QueryDetailsTemplate from './../templates/query-details.hbs';
import QueryTableTemplate from './../templates/query-table.hbs';
// have to run two queries when (1) filtering on startkey & endkey (2) looking for a sum
// (1) is because we wouldn't know the number of available rows for pagination
// (total_rows is all rows including those that don't match filter)

export default Backbone.View.extend({
  template: QueryViewTemplate,
  initialize: function(){
    this.render();
  },
  render: function() {
    this.$el.html(this.template());
    this.model.fetch().then((results)=>{
      this.renderTable();
      // if there's no key filtering, total_rows will be an accurate reflection
      // of rows for pagination  (but if sum is needed, we have to run the reduce query anyways)
      if (this.model.get('options').startkey && !this.model.get('include_sum')){
        this.renderDetails({
          model: this.model.toJSON(),
          rows_for_pagination: this.model.get('results').value.total_rows
        });
      }
    });
    if (this.model.get('options').startkey || this.model.get('include_sum')){
      this.reduce_model = new DefaultQueryModel(this.model.toJSON());
      var options = _.clone(this.model.get('options'));
      options.reduce = true;
      this.reduce_model.set('options',options);
      this.reduce_model.fetch().then(()=>{
        var rows_for_pagination = this.reduce_model.get('results').rows[0] ? this.reduce_model.get('results').rows[0].value.count : 0;
        this.renderDetails({
          model: this.reduce_model.toJSON(),
          rows_for_pagination: rows_for_pagination
        });
      });
    }
  },
  renderDetails: function(modelJSON){
    this.$el.find('.details').html(QueryDetailsTemplate(modelJSON));
  },
  renderTable: function(){
    if (this.model.get('results').rows[0]){
      // _.find(this.model.db.createCouchViews.couch_views,{name: this.model.get('query')}).mapFun
      var header = _.keys(this.model.get('results').rows[0]);
      this.$el.find('table').html(QueryTableTemplate({
        header: header,
        results: this.model.get('results').rows
      }));
    }
  }
});
