const { ReviewModel } = require('./initDB');

module.exports = (reviewPOST) => {
  const photos = reviewPOST.photos.slice();
  const reviewDoc = { ...reviewPOST };
  reviewDoc.photos = [];
  photos.forEach((url) => {
    reviewDoc.photos.push({ url });
  });

  return ReviewModel.create(reviewDoc);
};
