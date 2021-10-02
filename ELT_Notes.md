# Importing a CSV into mongoDB
`mongoimport --type csv -d mantle -c reviews_original --headerline --drop reviews.csv`

`mongoimport --type csv -d mantle -c reviews_photos --headerline --drop reviews_photos.csv`

`mongoimport --type csv -d mantle -c characteristics --headerline --drop characteristics.csv`

`mongoimport --type csv -d mantle -c characteristics_reviews --headerline --drop characteristics_reviews.csv`

# Create Indexes to massively speed up lookups

`db.reviews_photos.createIndex({review_id: 1})` // so we can $lookup review_id quickly.

`db.reviews_original.createIndex({product_id: 1})` // product_id is the main search method to find relevant reviews

`db.reviews_original.createIndex({id: 1})` // $lookup uses this for localField

`db.characteristics.createIndex({product_id: 1})`

`db.characteristics_reviews.createIndex({characteristic_id: 1})`

# MongoDB Aggregation Pipeline Stages

## `$lookup` to embed documents from one collection into another

```
db.reviews_original.aggregate([
  {$lookup: {
      from: "reviews_photos",
      localField: "id",
      foreignField: "review_id",
      as: "photos"
    }}
])
```
## `$project` stage to modify fields 
e.g. `id` -> `review_id`, and date's number type to a proper Date type

```
db.reviews_original.aggregate([
  {$project: {
    "_id": 0,
    "review_id": "$id",
    "product_id": "$product_id",
    "rating": "$rating",
    "summary": "$summary",
    "recommend": "$recommend",
    "date": { $toDate: "$date" },
    "reviewer_name": "$reviewer_name",
    "reviewer_email": "$reviewer_email",
    "response": "$response",
    "helpfulness": "$helpfulness",
    "photos": "$photos",
    }}
])
```

### All together, we can create a pipeline that will embed photos, rename id to review_id, change date to an ISODate type, only keep the id and url for each photo document, and output to a collection

```
db.reviews_original.aggregate([
  {$lookup: {
      from: "reviews_photos",
      localField: "id",
      foreignField: "review_id",
      as: "photos"
    }},
  {$project: {
    "_id": 0,
    "review_id": "$id",
    "product_id": "$product_id",
    "rating": "$rating",
    "summary": "$summary",
    "recommend": "$recommend",
    "date": { $toDate: "$date" },
    "reviewer_name": "$reviewer_name",
    "reviewer_email": "$reviewer_email",
    "response": "$response",
    "helpfulness": "$helpfulness",
    "photos.id": 1,
    "photos.url": 1
    }},
  {$out: {
    db: "mantle", 
    coll: "reviews"
  }}
])
```
Don't forget to create indexes on that new, transformed set of data:
`db.reviews.createIndex({product_id: 1})`
`db.reviews.createIndex({review_id: 1})`

## `$sample` to randomly get documents
This will let me set up a small collection of random samples of data to test against (if the samples change, the tests will need to change also...)

```
db.reviews_original.aggregate([
  {$sample: {size: 20}},
  {$out: {
    db: "mantle", 
    coll: "reviews_test"
  }}
])
```

# Export from the database to a file 

useful in my case to save a test set of data.

https://docs.mongodb.com/database-tools/mongoexport/#synopsis

`mongoexport --db=mantle --collection=reviews_test --out=reviewsTestData.json`

use `mongoimport` or Mongoose's `Model.insertMany()` to later to restore the data and use it.
