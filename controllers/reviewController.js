const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Create a new review
const createReview = async (req, res) => {
  const review = {
    bookId: ObjectId(req.body.bookId),         // Assuming bookId is stored as ObjectId in MongoDB
    reviewerId: ObjectId(req.body.reviewerId), // Assuming reviewerId is stored as ObjectId in MongoDB
    rating: req.body.rating,
    reviewText: req.body.reviewText,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const response = await mongodb.getDb().db().collection('reviews').insertOne(review);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the review.');
    }
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json('Internal Server Error');
  }
};

module.exports = {
  createReview,
};
