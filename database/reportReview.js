const { ReviewModel, ReviewReportedModel } = require('./Models');

module.exports = (reviewId) => {
  let reportedReview;
  return ReviewModel.findOne({ review_id: reviewId })
    .then((result) => {
      reportedReview = result;
      return ReviewReportedModel.create(result.toObject());
    })
    .then(() => {
      reportedReview.remove();
    });
};
