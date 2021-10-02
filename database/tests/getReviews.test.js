const expect = require('chai').expect;
const mongoose = require('mongoose');
const { ReviewModel } = require('../initDB');
const { getReviews } = require('../index');
const reviewsSampleData = require('./reviewsSampleData')

describe('getReviews', () => {
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
        return ReviewModel.insertMany(reviewsSampleData)
      })
      .then((res) => {
        expect(res).to.have.length(10);
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
    getReviews(4)
    .then((data) => {
      expect(data).to.have.lengthOf(2);
      done();
    })
    .catch(done);
  });

  it('should retrieve data sorted by newest first');
  it('should retrieve data sorted by most helpful first');
  it('should retrieve data sorted by most relevant first');
}); // end describe()
