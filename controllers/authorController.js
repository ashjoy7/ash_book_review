const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllAuthors = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('authors').find().toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('authors').findOne({ _id: authorId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createAuthor = async (req, res) => {
  try {
    const author = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      birthDate: req.body.birthDate,
      deathDate: req.body.deathDate,
      booksWritten: req.body.booksWritten,
      quote: req.body.quote
    };
    const response = await mongodb.getDb().db().collection('authors').insertOne(author);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const author = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      birthDate: req.body.birthDate,
      deathDate: req.body.deathDate,
      booksWritten: req.body.booksWritten,
      quote: req.body.quote
    };
    const response = await mongodb.getDb().db().collection('authors').replaceOne({ _id: authorId }, author);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Some error occurred while updating the author.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('authors').deleteOne({ _id: authorId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Some error occurred while deleting the author.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
