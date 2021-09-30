const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.status(200).send('This is the endpoint for review data');
});

app.get('/reviews', (req, res) => {
  // TODO: function that will get and shape data from DB
});

app.get('/revews/meta', (req, res) => {
  // TODO
});

app.post('/reviews', (req, res) => {
  // TODO
});

app.put('/reviews/:review_id/helpful', (req) => {
  const reviewId = req.params.review_id;
});

app.put('/reviews/:review_id/report', () => {

});

app.listen(port, () => {
  console.log('== Running on port ', port, '! ==');
  console.log('🚀🚀🚀🚀🚀🚀');
  console.log('==========');
});
