const expect = require('chai').expect;
const mongoose = require('mongoose');
const { addReview } = require('../index');

describe('', () => {
  before((done) => {
    // initDB connected first, so we have to reconnect to test db
    mongoose.disconnect()
      .then(() => {
        return mongoose.connect('mongodb://localhost:27017/test')
      })
      .then(() => done())
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

  it('a valid review should be added to the Reviews collection/database', (done) => {
    const reviewBodyData = {
      product_id: 1234,
      rating: 5,
      summary: 'This is the summary',
      body: 'The body of the review',
      recommend: true,
      name: 'someUsername',
      email: 'helloworld@domain.test',
      photos: ['http://someimage.test', 'http://anotherimage.test'],
      characteristics: {'4321': 3},
    };

    addReview(reviewBodyData)
      .then(() => {
        return mongoose.connection.db.collection('reviews').findOne({product_id: 1234});
      })
      .then((result) => {
        expect(result.product_id).to.equal(1234);
        expect(result.rating).to.equal(5);
        expect(result.summary).to.equal('This is the summary');
        expect(result.body).to.equal('The body of the review');
        expect(result.recommend).to.equal(true);
        expect(result.reviewer_name).to.equal('someUsername');
        expect(result.reviewer_email).to.equal('helloworld@domain.test');
        expect(result.response).to.equal(null);
        expect(result.photos, 'photos array length').to.have.length(2);
        expect(result.photos[0].url).to.be.oneOf(['http://someimage.test', 'http://anotherimage.test']);
        expect(result.photos[1].url).to.be.oneOf(['http://someimage.test', 'http://anotherimage.test']);
        done();
      })
      .catch(done);
  });
});
