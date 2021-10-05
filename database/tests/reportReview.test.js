const expect = require('chai').expect;
const mongoose = require('mongoose');
const { reportReview, getReviews } = require('../index');
const { ReviewModel } = require('../initDB');
const { reviewsTestData } = require('./testData');

describe('reportReview', () => {
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

  it('should cause subsequent getReviews() to be missing that particular review', (done) => {
    // product ID 353442 has a review - ID 2040880 - that will be reported.
    getReviews(353442)
      .then((reviews) => {
        expect(reviews, 'initial quantity of reviews').to.have.length(3);
        return reportReview(2040880);
      })
      .then(() => {
        return getReviews(353442);
      })
      .then((reviews) => {
        expect(reviews, 'quantity of reviews after reporting').to.have.length(2);
        expect(reviews[0].review_id).to.not.equal(2040880);
        expect(reviews[1].review_id).to.not.equal(2040880);
        return mongoose.connection.db.collection('ReviewsReported').findOne({review_id: 2040880})
      })
      .then((result) => {
        expect(result.review_id).to.equal(2040880);
        done();
      })
      .catch(done);
  });

}); //end describe()
