import $ from 'jquery';
import Backbone from 'backbone';

import PaginationTemplate from './../templates/pagination.hbs';

export default Backbone.View.extend({
  template: PaginationTemplate,
  initialize: function(){
    // TODO: pass in actual limit. temporarily setting here
    if (!this.model.get('limit')){
      this.model.set('limit') = 1000;
    }
    this.render();
  },
  render: function() {
    if (this.model.get('skip') + this.model.get('limit') <= this.model.get('total_rows_length')){
      
    }
    this.$el.html(this.template(this.model.toJSON()));
  }
});
