const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Create a new author
const createAuthor = async (req, res) => {
  const author = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio,
    birthdate: req.body.birthdate,
    deathdate: req.body.deathdate,
    booksWritten: req.body.booksWritten,
    quote: req.body.quote
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

module.exports = {
  createAuthor,
};
