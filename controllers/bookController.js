const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await mongodb.getDb().db().collection('books').find().toArray();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json('Internal Server Error');
  }
};

// Get a single book by ID
const getBookById = async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await mongodb.getDb().db().collection('books').findOne({ _id: ObjectId(bookId) });
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json('Book not found');
    }
  } catch (error) {
    console.error(`Error fetching book with id ${bookId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

// Create a new book
const createBook = async (req, res) => {
  const book = {
    title: req.body.title,
    authorId: ObjectId(req.body.authorId), // Assuming authorId is stored as ObjectId in MongoDB
    genreId: ObjectId(req.body.genreId),   // Assuming genreId is stored as ObjectId in MongoDB
    publishedDate: req.body.publishedDate,
    summary: req.body.summary,
  };

  try {
    const response = await mongodb.getDb().db().collection('books').insertOne(book);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the book.');
    }
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json('Internal Server Error');
  }
};

// Update an existing book
const updateBook = async (req, res) => {
  const bookId = req.params.id;
  const updateFields = {
    title: req.body.title,
    authorId: ObjectId(req.body.authorId), // Assuming authorId is stored as ObjectId in MongoDB
    genreId: ObjectId(req.body.genreId),   // Assuming genreId is stored as ObjectId in MongoDB
    publishedDate: req.body.publishedDate,
    summary: req.body.summary,
  };

  try {
    const response = await mongodb.getDb().db().collection('books').updateOne(
      { _id: ObjectId(bookId) },
      { $set: updateFields }
    );
    if (response.modifiedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json('Book not found');
    }
  } catch (error) {
    console.error(`Error updating book with id ${bookId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  const bookId = req.params.id;
  try {
    const response = await mongodb.getDb().db().collection('books').deleteOne({ _id: ObjectId(bookId) });
    if (response.deletedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json('Book not found');
    }
  } catch (error) {
    console.error(`Error deleting book with id ${bookId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
