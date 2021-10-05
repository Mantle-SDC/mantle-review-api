const { ReviewModel } = require('./initDB');

module.exports = (reviewId) => (
  ReviewModel.updateOne({ review_id: reviewId }, { $inc: { helpfulness: 1 } })
);
