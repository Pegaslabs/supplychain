import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import db from './../services/db'
import HeaderTemplate from './../templates/header.hbs';
import SearchView from './search.js';

export default Backbone.View.extend({
  template: HeaderTemplate,
  initialize: function(){
    this.db = new db();
    this.render();
  },
  render: function() {
    this.$el.html(this.template());
    this.$el.find('.search-holder').append(new SearchView('items-by-name').el);
  },
  events:{
    'click #admin': 'toggleAdmin',
    'click #toggleNav': 'toggleNav'
  },
  toggleNav: function(e){
    e.preventDefault();
    $('#collapsedNav').toggle();
  },
  toggleAdmin: function(e){
    e.preventDefault();
    $('#adminDropDown').toggle();
  }
});
