import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';

export default Backbone.View.extend({

  template: _.template('Hello <%= name %> !'),
	el: $("#dash"),
  initialize: function(){
    console.log('oh yeha!');
  }

});
