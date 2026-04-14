MongoDb methods

db.collectionName.insertOne/inserMany -- to insert data/if insertMany you have to pass array of objects

show connection-- show all connections available on your Mongodb compass

db.collectionName.find() - find all object/data in collection

db.collectionName.find().count() -- count number of data in collection

db.dropDatabase -- to delete database

db.use(collectionName) -- To use connection

db.collectionName.find().limit() -- give data till limit only

db.collectionName.find({},{_id:0,name:1,price:1}) -- only give data that you want,ignores remaning object data

db.collectionName.find({condition}) -- find conditional base data example price:599,city:'Mathura'

db.product.find({name:'Laptop Stand'}) -- search data based on key we can add also .limit() for limit 

db.collectionName.find({price:{$gt:150}}) -- $gt is used for search greater than value here it will search price grater than 150 or//gte greater than equal to

db.collectionName.find({price:{$lt:1200}}) -- $lt is used for search less than value here it will search price less than 1200 or//lte less than equal to

db.collectionName.find().sort({price:1}).limit(5) -- sort the value in ascending order here price will sorted in ascending order

db.collectionName.find().sort({price:-1}).limit(5) -- sort the value in descending order here price will sorted in descending order

db.collectionName.find({name:{$regex:/^L/}}) -- to find patterns in db example like name starting with L

db.collectionName.find({name:{$regex:/^L/i}}) -- to find patterns but it is case in-sensitive ignore case sensitive 

 db.collectionName.find({name:{$regex:/^[bl]/i}}) -- works like or operator either b or l find at first place it will return 




 



