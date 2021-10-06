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
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('This is the endpoint for review data');
});

app.get('/reviews', (req, res) => {
  const responseData = {
    product: req.query.product_id,
    page: req.query.page || 1,
    count: req.query.count || 5,
  };

  getReviews(req.query.product_id, req.query.sort, req.query.count, req.query.page)
    .then((data) => {
      responseData.results = data;
      res.status(200).send(responseData);
    })
    .catch((err) => {
      res.status(401).send('Error retrieving from database');
      logger.error(err);
    });
});

const countReducer = (prev, curr) => {
  const responseObj = prev;
  if (responseObj[curr] === undefined) responseObj[curr] = 0;
  responseObj[curr] += 1;
  return responseObj;
};

const characteristicReducer = (prev, curr) => {
  const responseObj = prev;
  responseObj[curr.name] = { id: curr.characteristic_id, value: curr.average };
  return responseObj;
};

app.get('/reviews/meta', (req, res) => {
  const responseData = {
    product_id: req.query.product_id,
    ratings: {},
    recommended: {},
    characteristics: {},
  };

  getReviewsMeta(req.query.product_id)
    .then((data) => {
      responseData.ratings = data.ratings.reduce(countReducer, {});
      responseData.recommended = data.recommends.reduce(countReducer, {});
      responseData.characteristics = data.characteristics.reduce(characteristicReducer, {});
      res.status(200).send(responseData);
    })
    .catch((err) => {
      res.status(401).send('Error retrieving from database');
      logger.error(err);
    });
});

app.post('/reviews', (req, res) => {
  addReview(req.body)
    .then(() => {
      res.status(201).send('CREATED');
    })
    .catch((err) => {
      res.status(500).send('Internal server error');
      logger.error('Error updating database:', err);
    });
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  markHelpful(req.params.review_id)
    .then(() => {
      res.status(204).send('NO CONTENT');
    })
    .catch((err) => {
      res.status(500).send('Internal server error');
      logger.error('Error updating database:', err);
    });
});

app.put('/reviews/:review_id/report', (req, res) => {
  reportReview(req.params.review_id)
    .then(() => {
      res.status(204).send('NO CONTENT');
    })
    .catch((err) => {
      res.status(500).send('Internal server error');
      logger.error('Error querying or moving reported review:', err);
    });
});

module.exports.app = app;
