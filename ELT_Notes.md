# Initial import/setup

## Importing a CSV into mongoDB
`mongoimport --type csv -d mantle -c reviews_original --headerline --drop reviews.csv`

`mongoimport --type csv -d mantle -c reviews_photos --headerline --drop reviews_photos.csv`

`mongoimport --type csv -d mantle -c characteristics --headerline --drop characteristics.csv`

`mongoimport --type csv -d mantle -c characteristics_reviews --headerline --drop characteristics_reviews.csv`

## Create Indexes to massively speed up lookups

`db.reviews_photos.createIndex({review_id: 1})` // so we can $lookup review_id quickly.

`db.reviews_original.createIndex({product_id: 1})` // product_id is the main search method to find relevant reviews

`db.reviews_original.createIndex({id: 1})` // $lookup uses this for localField

`db.characteristics.createIndex({id: 1})`

`db.characteristics.createIndex({product_id: 1})`

`db.characteristics_reviews.createIndex({characteristic_id: 1})`
`db.characteristics_reviews.createIndex({review_id: 1});`

# The ***reviews*** collection

Use the `$lookup` stage to embed documents from one collection into another, e.g.:

```
...
  {$lookup: {
      from: "reviews_photos",
      localField: "id",
      foreignField: "review_id",
      as: "photos"
    }}
...
```
The `$project` stage is powerful and can be used to modify/shape the document - present new fields that are based on other fields, hide fields, perform operations that change fields' type and/or data, etc.

e.g. `id` -> `review_id`, and date's number type to a proper Date type

```
...
  {$project: {
    "_id": 0,
    "review_id": "$id",
    "product_id": "$product_id",
    "rating": "$rating",
    "summary": "$summary",
    "body": "$body",
    "recommend": "$recommend",
    "date": { $toDate: "$date" },
    "reviewer_name": "$reviewer_name",
    "reviewer_email": "$reviewer_email",
    "response": "$response",
    "helpfulness": "$helpfulness",
    "photos": "$photos",
    }}
...
```

The `$out` stage must be the last stage, and writes the resulting documents of the aggregation pipeline to a collection:

```
...
  {$out: {
    db: "mantle", 
    coll: "reviews"
  }}
]) // closing braces of aggregate()
```

## Final *mongosh* statement

All together, we can create a pipeline that will embed photos, rename id to review_id, change date to an ISODate type, only keep the id and url for each photo document, and output to a collection

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
    "body": "$body",
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
Don't forget to create relevant indexes on the new, transformed collection of data:
`db.reviews.createIndex({product_id: 1})`
`db.reviews.createIndex({review_id: 1})`


# The ***reviewsMeta*** collection

These ELT steps are for creating a collection that is closer to the structure of the API response from /reviews/meta.


**Create documents that provide characteristics' average score and count of reviews:**

```
db.characteristics_reviews.aggregate([
    {$group: {
        _id: "$characteristic_id",
        reviewCount: {$count: {}},
        average: {$avg: "$value"},
        rawValues: {$push: "$value"}
        }},
    {$out: {
        db: "mantle",
        coll: "characteristics_averages",
    }},
], {allowDiskUse: true});
```

51 s

**Aggregation that will pull in the average values/ratings of that characteristic**

*$replaceRoot is used to create a single document that has the review stats 'flattened' to the same level as the other keys*

```
db.characteristics.aggregate([
    {$lookup: {
        from: "characteristics_averages",
        localField: "id",
        foreignField: "_id",
        as: "reviewStats"
        }},
    {$replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$reviewStats", 0]}, "$$ROOT" ]}}},
    {$set: {"characteristic_id": "$id"}},
    {$unset: ["reviewStats", "id"]},
    {$out: {
        db: "mantle",
        coll: "characteristics_combined",
    }},
], {allowDiskUse: true});

db.characteristics_combined.createIndex({product_id: 1});
```

198 s

*Create index*:

`db.characteristics_combined.createIndex({product_id: 1});`


**Get the ratings and recommends of a single product into a single document, as well as characteristics ratings. This completes the reviewsMeta collection**

```
db.reviews.aggregate([
    {$group: {
        _id: "$product_id",
        ratings: {$push: "$rating"},
        recommends: {$push: "$recommend"},
        }},
    {$lookup: {
        from: "characteristics_combined",
        localField: "_id",
        foreignField: "product_id",
        as: "characteristics",
    }},
    {$out: {
        db: "mantle",
        coll: "reviewsMeta",
    }}
], {allowDiskUse: true});
```
73 s

_id is the product ID, and is already indexed.

# Miscellaneous

## Use the `$sample` stage to randomly get documents

This will let me set up a small collection of random samples of data to test against (if the samples change, the tests will need to change also...)

```
db.reviews.aggregate([
  {$sample: {size: 20}},
  {$out: {
    db: "mantle", 
    coll: "reviews_test"
  }}
])
```

## Export from the database to a file 

useful in my case to save a test set of data.

https://docs.mongodb.com/database-tools/mongoexport/#synopsis

`mongoexport --db=mantle --collection=reviews_test --out=reviewsTestData.json`

Use `mongoimport` or Mongoose's `Model.insertMany()` to later to restore the data and use it.

You will likely need to manually edit the data a bit because JSON does not store *type* information, and you may not care to keep old ObjectId information.
