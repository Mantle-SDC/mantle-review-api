const { ReviewModel } = require('./initDB');

module.exports = (reviewPOST) => {
  const photos = reviewPOST.photos.slice();
  const reviewDoc = { ...reviewPOST };
  reviewDoc.photos = [];
  photos.forEach((url) => {
    reviewDoc.photos.push({ url });
  });

  if (reviewDoc.summary || reviewDoc.summary === '') {
    reviewDoc.summary = reviewDoc.body.slice(0, 50);
  }

  return ReviewModel.collection.estimatedDocumentCount()
    .then((count) => {
      reviewDoc.review_id = count + 1;
      return ReviewModel.create(reviewDoc);
    });
};
