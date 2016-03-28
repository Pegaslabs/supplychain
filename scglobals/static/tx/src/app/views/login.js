import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import LoginTemplate from './../templates/login.hbs';
import DB from './../services/db';

export default Backbone.View.extend({
  template: LoginTemplate,
  events: {
    'submit .login': 'submitLogin'
  },
  initialize: function(options,userSettings){
    this.db = new DB();
    this.render();
  },
  render: function(){
    this.$el.html(this.template());
  },
  submitLogin: function(e){
    e.preventDefault();
    this.db.db.login(this.$el.find('.username').val(), this.$el.find('.password').val())
    .then(()=> {
      window.location.href = "/#/";
    }).catch((error)=> {
      this.$el.find('.input-group').addClass('has-error');
    });
  }
});
