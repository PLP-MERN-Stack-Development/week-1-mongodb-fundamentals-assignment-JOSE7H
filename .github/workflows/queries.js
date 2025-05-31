const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Task 2: Basic CRUD Operations

    // Find all books in a specific genre
    console.log('\nBooks in Fiction Genre:');
    console.log(await collection.find({ genre: 'Fiction' }).toArray());

    // Find books published after a certain year
    console.log('\nBooks published after 2000:');
    console.log(await collection.find({ published_year: { $gt: 2000 } }).toArray());

    // Find books by a specific author
    console.log('\nBooks by George Orwell:');
    console.log(await collection.find({ author: 'George Orwell' }).toArray());

    // Update the price of a specific book
    await collection.updateOne({ title: '1984' }, { $set: { price: 12.99 } });
    console.log('\nUpdated book price for "1984".');

    // Delete a book by its title
    await collection.deleteOne({ title: 'Moby Dick' });
    console.log('\nDeleted "Moby Dick" from collection.');

    // Task 3: Advanced Queries

    console.log('\nBooks in stock and published after 2010:');
    console.log(await collection.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray());

    console.log('\nProjection - Title, Author, Price:');
    console.log(await collection.find({}, { projection: { title: 1, author: 1, price: 1 } }).toArray());

    console.log('\nBooks sorted by price (Ascending):');
    console.log(await collection.find().sort({ price: 1 }).toArray());

    console.log('\nBooks sorted by price (Descending):');
    console.log(await collection.find().sort({ price: -1 }).toArray());

    console.log('\nPagination - First 5 books:');
    console.log(await collection.find().limit(5).toArray());

    console.log('\nPagination - Next 5 books:');
    console.log(await collection.find().skip(5).limit(5).toArray());

    // Task 4: Aggregation Pipeline
    console.log('\nAverage price by genre:');
    console.log(await collection.aggregate([{ $group: { _id: "$genre", avg_price: { $avg: "$price" } } }]).toArray());

    console.log('\nAuthor with the most books:');
    console.log(await collection.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray());

    console.log('\nBooks grouped by publication decade:');
    console.log(await collection.aggregate([
      { $project: { decade: { $floor: { $divide: ["$published_year", 10] } } } },
      { $group: { _id: "$decade", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray());

    // Task 5: Indexing
    await collection.createIndex({ title: 1 });
    console.log('\nIndex on title created.');

    await collection.createIndex({ author: 1, published_year: -1 });
    console.log('\nCompound index on author and published year created.');

    console.log('\nIndex performance with explain():');
    console.log(await collection.find({ title: '1984' }).explain("executionStats"));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('\nConnection closed.');
  }
}

runQueries().catch(console.error);
