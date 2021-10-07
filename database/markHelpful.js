const { ReviewModel } = require('./Models');

module.exports = (reviewId) => (
  ReviewModel.updateOne({ review_id: reviewId }, { $inc: { helpfulness: 1 } })
);
