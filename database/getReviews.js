const { ReviewModel } = require('./initDB');

const getReviews = (productId) => ReviewModel.find({
  product_id: productId,
});

module.exports = getReviews;
