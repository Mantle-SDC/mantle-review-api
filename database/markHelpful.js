const { ReviewModel } = require('./initDB');

module.exports = (reviewId) => {
  return ReviewModel.updateOne({ review_id: reviewId }, { $inc: { helpfulness: 1 } });
};
