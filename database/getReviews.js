const { ReviewModel } = require('./initDB');

const getReviews = (productId, sort = 'newest', count = 5, page = 1) => {
  const intCount = parseInt(count, 10);
  const intPage = parseInt(page, 10);
  const query = ReviewModel
    .find({
      product_id: productId,
    }, '-__v -_id -product_id -reviewer_email -characteristics');
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

  if (page > 1) {
    query.skip((intPage - 1) * intCount);
  }

  query
    .limit(intCount)
    .sort(sortObj)
    .lean();

  return query;

  // we need to look up how to efficiently 'paginate' in MongoDB.
  // Bucket pattern?
  // is there a 'range' operator/function in MongoDB?
  // mapreduce for generating a relevancy score? Mapreduce may be deprecated...
  // For now, just skip() (not optimal, mongo must get the data first before skipping it...)
};

module.exports = getReviews;
