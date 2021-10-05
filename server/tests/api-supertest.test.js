const expect = require('chai').expect;
const request = require('supertest');
const { app } = require('../app');
const mongoose = require('mongoose');

describe('/reviews', () => {
  const reviewTestData = {"body": "some body","photos":[],"review_id":2040880,"product_id":353442,"rating":3,"summary":"Harum exercitationem quod voluptatem ut.","recommend":"true","date":"2020-10-03T16:39:18.628Z","reviewer_name":"Orland_Swaniawski99","reviewer_email":"Curt49@hotmail.com","response":"null","helpfulness":12};
  
  before((done) => {
    mongoose.disconnect()
      .then(() => {
        return mongoose.connect('mongodb://localhost:27017/test')
      })
      .then(() => {
        return mongoose.connection.db.collection('reviews').insertOne(reviewTestData);
      })
      .then(() => {
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

  it('should return a review containing all keys', (done) => {
    const rootKeys = [
      'product',
      'page',
      'count',
      'results',
    ];

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
      'photos',
    ];

    request(app)
      .get('/reviews')
      .query({product_id: 353442})
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.all.keys(rootKeys);
        expect(response.body.results[0]).to.have.all.keys(reviewKeys);
        done();
      })
      .catch(done);
  });

});

describe('/reviews/meta', () => {
  const reviewMetaTestData = {"_id":1,"ratings":[5,4],"recommends":["true","false"],"characteristics":[{"_id":{"$oid":"6154ab8311b5f884c45781cb"},"reviewCount":2,"average":4.0,"rawValues":[4,4],"product_id":1,"name":"Fit","characteristic_id":1},{"_id":{"$oid":"6154ab8311b5f884c45781cc"},"reviewCount":2,"average":3.5,"rawValues":[3,4],"product_id":1,"name":"Length","characteristic_id":2},{"_id":{"$oid":"6154ab8311b5f884c45781cd"},"reviewCount":2,"average":5.0,"rawValues":[5,5],"product_id":1,"name":"Comfort","characteristic_id":3},{"_id":{"$oid":"6154ab8311b5f884c45781ce"},"reviewCount":2,"average":4.0,"rawValues":[4,4],"product_id":1,"name":"Quality","characteristic_id":4}]};

  before((done) => {
    mongoose.disconnect()
      .then(() => {
        return mongoose.connect('mongodb://localhost:27017/test')
      })
      .then(() => {
        return mongoose.connection.db.collection('reviewsMeta').insertOne(reviewMetaTestData);
      })
      .then(() => {
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

  it('should return review metadata containing spec\'d keys', (done) => {
    const reviewMetaKeys = [
      'product_id',
      'ratings',
      'recommended',
      'characteristics',
    ];

    const characteristicsKeys = [
      'Fit',
     'Length',
     'Comfort',
     'Quality',
    ]

    request(app)
      .get('/reviews/meta')
      .query({product_id: 1})
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.all.keys(reviewMetaKeys);
        expect(response.body.characteristics).to.have.all.keys(characteristicsKeys);
        done();
      })
      .catch(done);
  });

});
