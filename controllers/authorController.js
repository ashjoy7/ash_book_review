const { getDb } = require('../db/connect');

// Get all authors
const getAllAuthors = async (req, res, next) => {
  try {
    const db = getDb();
    const authors = await db.collection('Authors').find().toArray();
    res.json(authors);
  } catch (error) {
    next(error);
  }
};

// Get author by ID
const getAuthorById = async (req, res, next) => {
  const authorId = req.params.authorId;
  try {
    const db = getDb();
    const author = await db.collection('Authors').findOne({ authorId });
    if (!author) {
      res.status(404).json({ message: 'Author not found' });
    } else {
      res.json(author);
    }
  } catch (error) {
    next(error);
  }
};

// Create a new author
const createAuthor = async (req, res, next) => {
  const { firstName, lastName, bio, birthdate, deathdate, booksWritten, quote } = req.body;
  try {
    const db = getDb();
    const result = await db.collection('Authors').insertOne({
      firstName,
      lastName,
      bio,
      birthdate,
      deathdate,
      booksWritten,
      quote,
    });
    res.status(201).json(result.ops[0]);
  } catch (error) {
    next(error);
  }
};

// Update an author by ID
const updateAuthor = async (req, res, next) => {
  const authorId = req.params.authorId;
  const updateFields = req.body;
  try {
    const db = getDb();
    const result = await db.collection('Authors').updateOne({ authorId }, { $set: updateFields });
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: 'Author not found' });
    } else {
      res.json({ message: 'Author updated successfully' });
    }
  } catch (error) {
    next(error);
  }
};

// Delete an author by ID
const deleteAuthor = async (req, res, next) => {
  const authorId = req.params.authorId;
  try {
    const db = getDb();
    const result = await db.collection('Authors').deleteOne({ authorId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Author not found' });
    } else {
      res.json({ message: 'Author deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
