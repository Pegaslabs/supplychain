import chai from 'chai';
let expect = chai.expect;

import ShipmentsCollection from '../src/app/collections/shipments';

describe('Filtering dates', function() {
  before(function(){
    this.shipmentsCollection = new ShipmentsCollection();
  });
  it('should return the ten shipments in that date range', function() {
    this.shipmentsCollection.fetch({startkey: '[2007-01-01,{},{}]',endkey: '[2008-01-01,{},{}]'})
    .then((result)=>{
      console.log('asdf',result);
      expect(this.shipmentsCollection.makeUrlParams()).to.equal('?');
    });
  });
});