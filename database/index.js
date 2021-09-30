const mongoose = require('mongoose');

mongoose.connect('mongodb://localost:27017/mantle');

const reviewSchema = new mongoose.Schema({
  review_id: Number,
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
const ReviewModel = mongoose.model('Review', reviewSchema, 'reviews');
export default ReviewModel;
