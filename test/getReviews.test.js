const expect = require('chai').expect;
const { getReviews } = require('../database/index');

describe('getReviews', () => {
  /* 
  TODO: somehow test getReviews, but pointing it to the reviews_sample collection.
  As it is, these tests are hitting the real data/collection; so the tests will fail
  as soon as the data is different.
   */
  before(() => {
    require('../database/initDB');
  });

  after(() => {
    require('mongoose').disconnect();
  });

  it('should be able to retrieve data using productId', (done) => {
    getReviews(12)
    .then((data) => {
      expect(data).to.have.lengthOf(6);
      done();
    })
    .catch(done);
  });

}); // end describe()
