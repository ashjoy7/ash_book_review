const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Helper function to validate book data
const validateBookData = (data) => {
  return data && typeof data.title === 'string' && typeof data.authorName === 'string' && 
         typeof data.summary === 'string' && typeof data.quote === 'string' &&
         typeof data.publishedYear === 'number' && typeof data.genre === 'string';
};

// Helper function to update number of reviews
const updateNumReviews = async (bookId) => {
  if (ObjectId.isValid(bookId)) {
    const numReviews = await mongodb.getDb().db().collection('reviews').countDocuments({ bookId: new ObjectId(bookId) });
    await mongodb.getDb().db().collection('books').updateOne(
      { _id: new ObjectId(bookId) },
      { $set: { numReview: numReviews } }
    );
  }
};

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await mongodb.getDb().db().collection('books').find().toArray();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single book by ID
const getBookById = async (req, res) => {
  const bookId = req.params.bookId; // Updated to match route parameter

  if (!ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  try {
    const book = await mongodb.getDb().db().collection('books').findOne({ _id: new ObjectId(bookId) });
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error(`Error fetching book with id ${bookId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new book
const createBook = async (req, res) => {
  const book = {
    title: req.body.title,
    authorName: req.body.authorName,
    genre: req.body.genre, // Updated to genre instead of genreId
    publishedYear: req.body.publishedYear,
    summary: req.body.summary,
    quote: req.body.quote,
    numReview: 0, // Initialize with 0 reviews
  };

  if (!validateBookData(book)) {
    return res.status(400).json({ error: 'Invalid book data' });
  }

  try {
    const response = await mongodb.getDb().db().collection('books').insertOne(book);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the book.' });
    }
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing book
const updateBook = async (req, res) => {
  const bookId = req.params.bookId; // Updated to match route parameter
  const updateFields = {
    title: req.body.title,
    authorName: req.body.authorName,
    genre: req.body.genre, // Updated to genre instead of genreId
    publishedYear: req.body.publishedYear,
    summary: req.body.summary,
    quote: req.body.quote,
  };

  if (!ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  if (!validateBookData(updateFields)) {
    return res.status(400).json({ error: 'Invalid book data' });
  }

  try {
    const response = await mongodb.getDb().db().collection('books').updateOne(
      { _id: new ObjectId(bookId) },
      { $set: updateFields }
    );
    if (response.modifiedCount > 0) {
      await updateNumReviews(bookId);
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error(`Error updating book with id ${bookId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  const bookId = req.params.bookId; // Updated to match route parameter

  if (!ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  try {
    const response = await mongodb.getDb().db().collection('books').deleteOne({ _id: new ObjectId(bookId) });
    if (response.deletedCount > 0) {
      // Optionally, delete related reviews
      await mongodb.getDb().db().collection('reviews').deleteMany({ bookId: new ObjectId(bookId) });
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error(`Error deleting book with id ${bookId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
