const { getDb } = require('../db/connect');

// Get all books
const getAllBooks = async (req, res, next) => {
  try {
    const db = getDb();
    const books = await db.collection('Books').find().toArray();
    res.json(books);
  } catch (error) {
    next(error);
  }
};

// Get book by ID
const getBookById = async (req, res, next) => {
  const bookId = req.params.bookId;
  try {
    const db = getDb();
    const book = await db.collection('Books').findOne({ bookId });
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      res.json(book);
    }
  } catch (error) {
    next(error);
  }
};

// Create a new book
const createBook = async (req, res, next) => {
  const { title, authorId, genreId, publishedDate, summary } = req.body;
  try {
    const db = getDb();
    const result = await db.collection('Books').insertOne({
      title,
      authorId,
      genreId,
      publishedDate,
      summary,
    });
    res.status(201).json(result.ops[0]);
  } catch (error) {
    next(error);
  }
};

// Update a book by ID
const updateBook = async (req, res, next) => {
  const bookId = req.params.bookId;
  const updateFields = req.body;
  try {
    const db = getDb();
    const result = await db.collection('Books').updateOne({ bookId }, { $set: updateFields });
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      res.json({ message: 'Book updated successfully' });
    }
  } catch (error) {
    next(error);
  }
};

// Delete a book by ID
const deleteBook = async (req, res, next) => {
  const bookId = req.params.bookId;
  try {
    const db = getDb();
    const result = await db.collection('Books').deleteOne({ bookId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      res.json({ message: 'Book deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
