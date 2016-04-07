import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

import db from './../services/db'
import HeaderTemplate from './../templates/header.hbs';
import SearchView from './search.js';
import SearchLocationsView from './search-locations.js';

export default Backbone.View.extend({
  template: HeaderTemplate,
  events:{
    'click #admin': 'toggleAdmin',
    'click #toggleNav': 'toggleNav'
  },
  initialize: function(userSettings){
    this.userSettings = userSettings;
    this.db = new db();
    this.render();
  },
  render: function() {
    this.$el.html(this.template());
    var itemSearchModel = new Backbone.Model({
      query: 'items-by-name',
      buttonText: 'Items',
      titleText: 'Item Search',
      placeholder: 'item name'
    });
    var locationSearchModel = new Backbone.Model({
      query: 'locations-by-name',
      buttonText: this.userSettings.get('location'),
      titleText: 'Location Search',
      placeholder: 'search locations',
      userSettings: this.userSettings
    });
    this.$el.find('.search-holder').append(new SearchView(itemSearchModel).el);
    this.$el.find('.location-holder').append(new SearchLocationsView(locationSearchModel).el);
  },
  toggleNav: function(e){
    e.preventDefault();
    $('#collapsedNav').toggle();
  }
});
