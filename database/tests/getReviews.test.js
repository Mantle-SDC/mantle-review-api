const expect = require('chai').expect;
const mongoose = require('mongoose');
const { ReviewModel } = require('../initDB');
const { getReviews } = require('../index');
const { reviewsTestData } = require('./testData')

describe('getReviews', () => {
  before((done) => {
    // initDB connected first, so we have to reconnect to test db
    mongoose.disconnect()
      .then(() => {
        return mongoose.connect('mongodb://localhost:27017/test')
      })
      .then(() => {
        return ReviewModel.insertMany(reviewsTestData)
      })
      .then((res) => {
        expect(res).to.have.length(20);
        done();
      })
      .catch(done);

  });

  after((done) => {
    mongoose.connection.db.dropCollection('reviews')
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => done())
      .catch(done);
  });

  it('should be able to retrieve data using just productId', (done) => {
    getReviews(17424)
    .then((data) => {
      expect(data).to.have.length(1);
      expect(data[0].summary).to.match(/Ratione reiciendis commodi saepe molestiae qui et culpa/);
      done();
    })
    .catch(done);
  });

  it('should retrieve data sorted by newest first', (done) => {
    getReviews(353442, 'newest')
    .then((data) => {
      expect(data).to.have.length(3);
      expect(data[0].review_id).to.equal(4403042);
      expect(data[1].review_id).to.equal(2075842);
      expect(data[2].review_id).to.equal(2040880);
      done();
    })
    .catch(done);
  });

  it('should retrieve data sorted by most helpful first', (done) => {
    getReviews(308621, 'helpful')
    .then((data) => {
      expect(data).to.have.length(3);
      expect(data[0].helpfulness).to.equal(27);
      expect(data[1].helpfulness).to.equal(26);
      expect(data[2].helpfulness).to.equal(8);
      done();
    })
    .catch(done);
  });

  it('should retrieve data sorted by most relevant first');

  it('should retrieve data in the shape that is needed for the API response', (done) => {
    const reviewKeys = [
      'review_id',
      'rating',
      'summary',
      'recommend',
      'response',
      'body',
      'date',
      'reviewer_name',
      'helpfulness',
      'photos'
    ];

    // mongoose's lean() must be used for performance purposes
    getReviews(643752, 'helpful', 1)
    .then((data) => {
      expect(data).to.have.length(1);
      expect(data[0].review_id).to.equal(3716670);
      expect(data[0]).to.have.all.keys(reviewKeys);
      done();
    })
    .catch(done);
  })
}); // end describe()
