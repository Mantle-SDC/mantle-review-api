const mongoose = require('mongoose');

const connect = mongoose.connect('mongodb://localhost:27017/mantle');
module.exports.connect = connect;

const reviewSchema = new mongoose.Schema({
  id: Number,
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
