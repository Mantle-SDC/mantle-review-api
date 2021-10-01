const express = require('express');
const { getReviews } = require('../database/index');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.status(200).send('This is the endpoint for review data');
});

app.get('/reviews', (req, res) => {
  // TODO: function that will get and shape data from DB
  getReviews(req.params.product_id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => console.log('Error retrieving reviews from DB: ', err));
});

app.get('/revews/meta', (req, res) => {
  // TODO
  res.status(200).send('This is the GET /reviews/meta endpoint');
});

app.post('/reviews', (req, res) => {
  // TODO
  res.status(200).send('This is the POST /reviews/meta endpoint');
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  // TODO
  res.status(200).send('I received review_id ', req.params.review_id);
});

app.put('/reviews/:review_id/report', (req, res) => {
  // TODO
  res.status(200).send('I received review_id ', req.params.review_id);
});

app.listen(port, () => {
  console.log('== Running on port ', port, '! ==');
  console.log('🚀🚀🚀🚀🚀🚀');
  console.log('==========');
});
