const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllReviews = async (req, res, next) => {
  const { bookId } = req.params; // Correctly extract bookId from request parameters
  try {
    const reviews = await mongodb.getDb().db().collection('reviews').find({ bookId: ObjectId.createFromHexString(bookId) }).toArray();
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createReview = async (req, res) => {
  const { reviewer, content, rating } = req.body;
  const { bookId } = req.params; // Extract bookID from URL parameters

  if (!reviewer || !content || !rating) {
    return res.status(400).json({ error: 'Reviewer, content, and rating are required fields' });
  }

  try {
    // Check if the bookId exists in the database
    const bookExists = await mongodb.getDb().db().collection('books').findOne({ _id: ObjectId.createFromHexString(bookId) });
    if (!bookExists) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const review = {
      reviewer,
      content,
      rating,
      bookId: ObjectId.createFromTime(new Date().getTime()) // Create ObjectId based on time
    };

    const response = await mongodb.getDb().db().collection('reviews').insertOne(review);
    if (response.result.ok === 1) {
      res.status(201).json(response.ops[0]);
    } else {
      throw new Error('Failed to create review');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getReviewsById = async (req, res, next) => {
  const { bookId } = req.params; // Extract bookId from request parameters
  try {
    const reviews = await mongodb.getDb().db().collection('reviews').find({ bookId: ObjectId.createFromHexString(bookId) }).toArray();
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateReview = async (req, res) => {
  const { reviewId } = req.params; // Correctly extract reviewId
  const { reviewer, content, rating } = req.body;
  if (!reviewer || !content || !rating) {
    return res.status(400).json({ error: 'Reviewer, content, and rating are required fields' });
  }
  const updatedReview = {
    reviewer,
    content,
    rating
  };
  try {
    const response = await mongodb.getDb().db().collection('reviews').updateOne({ _id: ObjectId.createFromHexString(reviewId) }, { $set: updatedReview });
    if (response.modifiedCount === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const response = await mongodb.getDb().db().collection('reviews').deleteOne({ _id: ObjectId.createFromHexString(reviewId) });
    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllReviews,
  getReviewsById,
  createReview,
  updateReview,
  deleteReview
};
