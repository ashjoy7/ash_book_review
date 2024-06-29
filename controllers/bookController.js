const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

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

module.exports = {
  createBook,
};
