const { ReviewsMetaModel } = require('./initDB');

module.exports = (productId) => ReviewsMetaModel.findOne({ _id: productId }).lean();
