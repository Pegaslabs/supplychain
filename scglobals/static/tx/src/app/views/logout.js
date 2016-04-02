import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import DB from './../services/db';
import baseUrl from './../helpers/baseUrl';

export default Backbone.View.extend({
  initialize: function(options,userSettings){
    this.db = new DB();
    this.db.logout().then(function(){
      window.location.href = baseUrl();
    });
  }
});
