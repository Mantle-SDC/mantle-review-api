const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mantle')
  .then(() => {
    console.log('💾💾💾💾💾💾');
  })
  .catch((err) => console.log('Error connecting to database: ', err));

const reviewSchema = new mongoose.Schema({
  review_id: Number,
  product_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number,
  photos: [{
    id: Number, url: String,
  }],
});

// Name of the model, the schema to use, and - optionally - the exact name of the collection
// to use in the database.
module.exports.ReviewModel = mongoose.model('Review', reviewSchema, 'reviews');
