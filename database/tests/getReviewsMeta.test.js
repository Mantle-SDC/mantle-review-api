const expect = require('chai').expect;
const mongoose = require('mongoose');
const { ReviewsMetaModel } = require('../initDB');
const { getReviewsMeta } = require('../index');
const { reviewsMetaTestData } = require('./testData')

describe('getReviewsMeta', () => {
  before((done) => {
    // initDB connected first, so we have to reconnect to test db
    mongoose.disconnect()
      .then(() => {
        return mongoose.connect('mongodb://localhost:27017/test')
      })
      .then(() => {
        return ReviewsMetaModel.insertMany(reviewsMetaTestData)
      })
      .then((res) => {
        expect(res).to.have.length(10);
        done();
      })
      .catch(done);

  });

  after((done) => {
    mongoose.connection.db.dropCollection('reviewsMeta')
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => done())
      .catch(done);
  });

  it('should retrieve a single document given a product ID', (done) => {
    getReviewsMeta(1)
      .then((data) => {
        expect(typeof data).to.equal('object');
        done();
      })
      .catch(done);
  });

  it('should contain "ratings", "recommends", and "characteristics" keys', (done) => {
    const reviewsMetaKeys = [
      '_id',
      'ratings',
      'recommends',
      'characteristics'
    ]

    getReviewsMeta(2).select('-__v')
      .then((data) => {
        expect(data).to.have.all.keys(reviewsMetaKeys);
        done();
      })
      .catch(done);
  });
});
