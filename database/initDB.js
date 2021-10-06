const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mantle')
  .then(() => {
    console.log('💾💾💾💾💾💾');
  })
  .catch((err) => console.log('Error connecting to database: ', err));

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
});

const reviewSchema = new mongoose.Schema({
  review_id: Number,
  product_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: { type: String, default: null },
  body: String,
  date: { type: Date, default: Date.now() },
  reviewer_name: { type: String, alias: 'name' },
  reviewer_email: { type: String, alias: 'email' },
  helpfulness: Number,
  photos: [photoSchema],
});

const reviewMetaSchema = new mongoose.Schema({
  _id: Number,
  ratings: Array,
  recommends: Array,
  characteristics: Array,
});

// Name of the model, the schema to use, and - optionally - the exact name of the collection
// to use in the database.
module.exports.ReviewModel = mongoose.model('Review', reviewSchema, 'reviews');
module.exports.ReviewsMetaModel = mongoose.model('ReviewMeta', reviewMetaSchema, 'reviewsMeta');
module.exports.ReviewReportedModel = mongoose.model('ReviewReported', reviewSchema, 'ReviewsReported');
