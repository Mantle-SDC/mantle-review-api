const { ReviewModel } = require('./initDB');

module.exports = (reviewPOST) => {
  const reviewDoc = reviewPOST;
  return ReviewModel.create(reviewDoc);
};
