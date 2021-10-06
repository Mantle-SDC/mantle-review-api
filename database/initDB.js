const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

mongoose.connect('mongodb://localhost:27017/mantle')
  .then(() => {
    logger.info('💾💾💾💾💾💾');
  })
  .catch((err) => logger.error('Error connecting to database: ', err));

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
});

const reviewSchema = new mongoose.Schema({
  review_id: { type: Number, required: true },
  product_id: { type: Number, required: true },
  rating: { type: Number, required: true },
  summary: String,
  recommend: { type: Boolean, required: true },
  response: { type: String, default: null },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  reviewer_name: { type: String, alias: 'name', required: true },
  reviewer_email: { type: String, alias: 'email', required: true },
  helpfulness: { type: Number, default: 0 },
  photos: [photoSchema],
  characteristics: {},
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
