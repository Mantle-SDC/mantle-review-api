const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

module.exports.getReviews = require('./getReviews');
module.exports.getReviewsMeta = require('./getReviewsMeta');
module.exports.markHelpful = require('./markHelpful');
module.exports.reportReview = require('./reportReview');
module.exports.addReview = require('./addReview');

module.exports.dbConnect = () => (
  mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
    .then(() => {
      logger.info('Connected to mongodb://%s:%d, using database %s', process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME);
      logger.info('💾💾💾💾💾💾');
    })
    .catch((err) => logger.error('Error connecting to database. Are the parameters in the .env correct? Error: ', err))
);
