const express = require('express');
const {
  getReviews,
  getReviewsMeta,
  markHelpful,
  reportReview,
  addReview,
} = require('../database/index');
const { logger } = require('../utils/logger');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/reviews', (req, res) => {
  logger.debug('GET /reviews with query data: %o', req.query);
  const responseData = {
    product: req.query.product_id,
    page: req.query.page || 1,
    count: req.query.count || 5,
    results: [],
  };

  getReviews(req.query.product_id, req.query.sort, req.query.count, req.query.page)
    .then((dbResponse) => {
      logger.debug('Response from database: %o', dbResponse);
      if (dbResponse !== null) {
        responseData.results = dbResponse;
      }
      res.status(200).send(responseData);
      logger.debug('Sent status 200, with data: %o', responseData);
    })
    .catch((err) => {
      res.status(401).send('Error retrieving from database');
      logger.error('Error trying to get reviews from database: %o', err);
    });
});

const countReducer = (ratings = []) => {
  const ratingsCount = {};
  for (let i = 0; i < ratings.length; i += 1) {
    if (ratingsCount[ratings[i]] === undefined) ratingsCount[ratings[i]] = 0;
    ratingsCount[ratings[i]] += 1;
  }
  return ratingsCount;
};

const characteristicReducer = (prev, curr) => {
  const responseObj = prev;
  responseObj[curr.name] = { id: curr.characteristic_id, value: curr.average };
  return responseObj;
};

app.get('/reviews/meta', (req, res) => {
  logger.debug('GET /reviews/meta with query data: %o', req.query);
  const responseData = {
    product_id: req.query.product_id,
    ratings: {},
    recommended: {},
    characteristics: {},
  };

  getReviewsMeta(req.query.product_id)
    .then((dbResponse) => {
      logger.debug('Response from database: %o', dbResponse);
      if (dbResponse !== null) {
        logger.debug('database response is not null');
        responseData.ratings = countReducer(dbResponse.ratings);
        logger.debug('reduced ratings');
        responseData.recommended = countReducer(dbResponse.recommends);
        logger.debug('reduced recommended');
        responseData.characteristics = dbResponse.characteristics.reduce(characteristicReducer, {});
        logger.debug('reduced characteristics');
      }
      res.status(200).send(responseData);
      logger.debug('Sent status 200, with data: %o', responseData);
    })
    .catch((err) => {
      res.status(401).send('Error retrieving from database');
      logger.error(err);
    });
});

app.post('/reviews', (req, res) => {
  logger.debug('POST /reviews with body: %o', req.body);
  addReview(req.body)
    .then((dbResponse) => {
      logger.debug('Response from database: %o', dbResponse);
      res.status(201).send('CREATED');
      logger.debug('sent status 201 CREATED');
    })
    .catch((err) => {
      res.status(500).send('Internal server error');
      logger.error('Error updating database:', err);
    });
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  logger.debug('PUT /reviews/%d/helpful', req.params.review_id);
  markHelpful(req.params.review_id)
    .then((dbResponse) => {
      logger.debug('Response from database: %o', dbResponse);
      res.status(204).send('NO CONTENT');
      logger.debug('sent status 204 NO CONTENT');
    })
    .catch((err) => {
      res.status(500).send('Internal server error');
      logger.error('Error updating database:', err);
    });
});

app.put('/reviews/:review_id/report', (req, res) => {
  logger.debug('PUT /reviews/%d/report', req.params.review_id);
  reportReview(req.params.review_id)
    .then((dbResponse) => {
      logger.debug('Response from database: %o', dbResponse);
      res.status(204).send('NO CONTENT');
      logger.debug('sent status 204 NO CONTENT');
    })
    .catch((err) => {
      res.status(500).send('Internal server error');
      logger.error('Error querying or moving reported review:', err);
    });
});

module.exports.app = app;
