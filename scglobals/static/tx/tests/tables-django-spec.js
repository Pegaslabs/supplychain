import chai from 'chai';
let expect = chai.expect;

import TablesDjangoCollection from '../src/app/collections/tables-django';

describe('Base Django Collection', function() {
  before(function(){
    this.testCollectionNone = TablesDjangoCollection.extend({
      urlParams: {}
    });
    this.testCollectionOne = TablesDjangoCollection.extend({
      urlParams: {limit: 100}
    });
    this.testCollectionMany = TablesDjangoCollection.extend({
      urlParams: {limit: 100, offset: 500, item: "Cotrimox"}
    });
    this.testNone = new this.testCollectionNone();
    this.testOne = new this.testCollectionOne();
    this.testMany = new this.testCollectionMany();
  });
  it('Base django collection makes proper URL params', function() {
    expect(this.testNone.makeUrlParams()).to.be.empty;
    expect(this.testOne.makeUrlParams()).to.equal("limit=100");
    expect(this.testMany.makeUrlParams()).to.equal("limit=100&offset=500&item=Cotrimox");
  });
});