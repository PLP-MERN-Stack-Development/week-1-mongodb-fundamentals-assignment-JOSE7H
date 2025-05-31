
# MongoDB Queries for Bookstore

## Task 2: Basic CRUD Operations

# Find all books in a specific genre
db.books.find({ genre: "Fiction" })

# Find books published after a certain year
db.books.find({ published_year: { $gt: 2000 } })

# Find books by a specific author
db.books.find({ author: "George Orwell" })

# Update the price of a specific book
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 12.99 } }
)

# Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" })

## Task 3: Advanced Queries

# Find books that are in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } })

# Projection - Return only title, author, and price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })

# Sort books by price (Ascending)
db.books.find().sort({ price: 1 })

# Sort books by price (Descending)
db.books.find().sort({ price: -1 })

# Pagination - Get first 5 books
db.books.find().limit(5)

# Pagination - Get next 5 books
db.books.find().skip(5).limit(5)

## Task 4: Aggregation Pipeline

# Calculate average price by genre
db.books.aggregate([
  { $group: { _id: "$genre", avg_price: { $avg: "$price" } } }
])

# Find the author with the most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
])

# Group books by publication decade
db.books.aggregate([
  { $project: { decade: { $floor: { $divide: ["$published_year", 10] } } } } },
  { $group: { _id: "$decade", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])

## Task 5: Indexing

# Create an index on title
db.books.createIndex({ title: 1 })

# Create a compound index on author and published year
db.books.createIndex({ author: 1, published_year: -1 })

# Use explain() to demonstrate performance improvement
db.books.find({ title: "1984" }).explain("executionStats")






