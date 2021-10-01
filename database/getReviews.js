const { ReviewModel } = require('./initDB');

const getReviews = (productId, count = 5, sort = 'newest', page = 1) => {
  let sortObj = {};
  switch (sort) {
    case 'helpful':
      sortObj = { helpfulness: -1 };
      break;
    case 'relevant':
      sortObj = { date: -1 };
      break;
    case 'newest':
      sortObj = { date: -1 };
      break;
    default:
      sortObj = { date: -1 };
  }

  ReviewModel.find({
    product_id: productId,
  })
    .skip(page * count)
    .limit(count)
    .sort(sortObj);

  // we need to look up how to efficiently 'paginate' in MongoDB.
  // Bucket pattern?
  // is there a 'range' operator/function in MongoDB?
  // mapreduce for generating a relevancy score? Mapreduce may be deprecated...
  // For now, just skip() (not optimal, mongo must get the data first before skipping it...)
};

module.exports = getReviews;
