const expect = require('chai').expect;
const { getReviews } = require('../index');
/* 
The test do pass, but CI will fail because a real database connection is not possible.
Will resume this test once mocked.
 */
describe('getReviews', () => {
  /* 
  TODO: somehow test getReviews, but pointing it to the reviews_sample collection.
  As it is, these tests are hitting the real data/collection; so the tests will fail
  as soon as the data is different.
   */
  before(() => {
    require('../initDB');
  });

  after(() => {
    require('mongoose').disconnect();
  });

  xit('should be able to retrieve data using productId', (done) => {
    getReviews(12)
    .then((data) => {
      expect(data).to.have.lengthOf(6);
      done();
    })
    .catch(done);
  });

}); // end describe()