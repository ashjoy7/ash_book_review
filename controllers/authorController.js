const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Get all authors
const getAllAuthors = async (req, res) => {
  try {
    const authors = await mongodb.getDb().db().collection('authors').find().toArray();
    res.status(200).json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json('Internal Server Error');
  }
};

// Get a single author by ID
const getAuthorById = async (req, res) => {
  const authorId = req.params.id;
  try {
    const author = await mongodb.getDb().db().collection('authors').findOne({ _id: ObjectId(authorId) });
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json('Author not found');
    }
  } catch (error) {
    console.error(`Error fetching author with id ${authorId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

// Create a new author
const createAuthor = async (req, res) => {
  const author = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio,
    birthDate: req.body.birthDate,
    deathDate: req.body.deathDate,
    booksWritten: req.body.booksWritten,
    quote: req.body.quote,
  };

  try {
    const response = await mongodb.getDb().db().collection('authors').insertOne(author);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the author.');
    }
  } catch (error) {
    console.error('Error creating author:', error);
    res.status(500).json('Internal Server Error');
  }
};

// Update an existing author
const updateAuthor = async (req, res) => {
  const authorId = req.params.id;
  const updateFields = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio,
    birthDate: req.body.birthDate,
    deathDate: req.body.deathDate,
    booksWritten: req.body.booksWritten,
    quote: req.body.quote,
  };

  try {
    const response = await mongodb.getDb().db().collection('authors').updateOne(
      { _id: ObjectId(authorId) },
      { $set: updateFields }
    );
    if (response.modifiedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json('Author not found');
    }
  } catch (error) {
    console.error(`Error updating author with id ${authorId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

// Delete an author
const deleteAuthor = async (req, res) => {
  const authorId = req.params.id;
  try {
    const response = await mongodb.getDb().db().collection('authors').deleteOne({ _id: ObjectId(authorId) });
    if (response.deletedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json('Author not found');
    }
  } catch (error) {
    console.error(`Error deleting author with id ${authorId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
