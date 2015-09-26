import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import StockChangesTemplate from './../templates/transactions-tpls.hbs';

export default Backbone.View.extend({

  template: StockChangesTemplate,
  render: function(transactions) {
    return this.template({transactions: transactions});
  },
});
