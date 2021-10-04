const expect = require('chai').expect;
const mongoose = require('mongoose');
const { markHelpful } = require('../index');
const { ReviewModel } = require('../initDB');
const { reviewsTestData } = require('./testData');

describe('', () => {
  before((done) => {
    console.log('connecting...');
    // initDB connected first, so we have to reconnect to test db
    mongoose.disconnect()
      .then(() => {
        return mongoose.connect('mongodb://localhost:27017/test')
      })
      .then(() => {
        console.log('connected to /test');
        console.log('trying to insert...');
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

  it('should increment a review\'s helpfulness counter by 1', (done) => {
    let testReviewId = 2040880;

    ReviewModel.findOne({review_id: testReviewId}).lean()
      .then((data) => {
        expect(data.helpfulness).to.equal(12);
        return markHelpful(testReviewId);
      })
      .then(() => {
        return ReviewModel.findOne({review_id: testReviewId}).lean()
      })
      .then((data) => {
        expect(data.helpfulness).to.equal(13);
        done();
      })
      .catch(done)
  });
});
