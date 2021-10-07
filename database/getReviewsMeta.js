const { ReviewsMetaModel } = require('./Models');

module.exports = (productId) => ReviewsMetaModel.findOne({ _id: productId }).lean();
