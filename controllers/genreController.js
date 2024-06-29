const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Create a new genre
const createGenre = async (req, res) => {
  const genre = {
    name: req.body.name,
    description: req.body.description,
  };

  try {
    const response = await mongodb.getDb().db().collection('genres').insertOne(genre);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the genre.');
    }
  } catch (error) {
    console.error('Error creating genre:', error);
    res.status(500).json('Internal Server Error');
  }
};

module.exports = {
  createGenre,
};
