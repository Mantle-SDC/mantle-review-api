const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.status(200).send('This is the endpoint for review data');
});

app.listen(port, () => {
  console.log('== Running on port ', port, '! ==');
  console.log('🚀🚀🚀🚀🚀🚀');
  console.log('==========');
});
