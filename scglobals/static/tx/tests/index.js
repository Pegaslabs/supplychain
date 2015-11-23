import $ from 'jquery';
import Backbone from 'backbone';
import chai from 'chai';

let expect = chai.expect;

import Router from '../src/app/router';


describe('Integration tests', function() {
  $('body').append('<div id="supplychain"></div>');
  const router = new Router();
  Backbone.history.start();
  let $app = $('#supplychain');
  describe.only('Dashboard', function() {
    it('should render the header', function() {
      expect($app.text().toLowerCase()).to.contain('supply chain');
    });
    // it('should render the header', function() {
    //   expect($app.text().toLowerCase()).to.contain('supply chain');
    // });
  });

  describe('About page sample testing', function() {
    it('should render YO im the about page', function() {
      router.navigate('about', {trigger: true, replace: true});
      expect($app.text()).to.equal('YO im the about page');
    });
  });

});