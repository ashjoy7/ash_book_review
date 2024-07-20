const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Helper function to validate review data
const validateReviewData = (data) => {
  return data && ObjectId.isValid(data.bookId) && ObjectId.isValid(data.reviewerId) && 
         typeof data.rating === 'number' && typeof data.comment === 'string';
};

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await mongodb.getDb().db().collection('reviews').find().toArray();
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single review by ID
const getReviewById = async (req, res) => {
  const reviewId = req.params.id;

  if (!ObjectId.isValid(reviewId)) {
    return res.status(400).json({ error: 'Invalid review ID' });
  }

  try {
    const review = await mongodb.getDb().db().collection('reviews').findOne({ _id: ObjectId(reviewId) });
    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    console.error(`Error fetching review with id ${reviewId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new review
const createReview = async (req, res) => {
  const review = {
    bookId: req.body.bookId,
    reviewerId: req.body.reviewerId,
    rating: req.body.rating,
    comment: req.body.comment,
  };

  if (!validateReviewData(review)) {
    return res.status(400).json({ error: 'Invalid review data' });
  }

  try {
    const response = await mongodb.getDb().db().collection('reviews').insertOne(review);
    if (response.acknowledged) {
      // Optionally, update book's number of reviews
      await updateNumReviews(review.bookId);
      res.status(201).json(response);
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the review.' });
    }
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing review
const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const updateFields = {
    bookId: req.body.bookId,
    reviewerId: req.body.reviewerId,
    rating: req.body.rating,
    comment: req.body.comment,
  };

  if (!ObjectId.isValid(reviewId)) {
    return res.status(400).json({ error: 'Invalid review ID' });
  }

  if (!validateReviewData(updateFields)) {
    return res.status(400).json({ error: 'Invalid review data' });
  }

  try {
    const response = await mongodb.getDb().db().collection('reviews').updateOne(
      { _id: ObjectId(reviewId) },
      { $set: updateFields }
    );
    if (response.modifiedCount > 0) {
      // Optionally, update book's number of reviews
      await updateNumReviews(updateFields.bookId);
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    console.error(`Error updating review with id ${reviewId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  if (!ObjectId.isValid(reviewId)) {
    return res.status(400).json({ error: 'Invalid review ID' });
  }

  try {
    const response = await mongodb.getDb().db().collection('reviews').deleteOne({ _id: ObjectId(reviewId) });
    if (response.deletedCount > 0) {
      // Optionally, update book's number of reviews
      const review = await mongodb.getDb().db().collection('reviews').findOne({ _id: ObjectId(reviewId) });
      if (review) {
        await updateNumReviews(review.bookId);
      }
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    console.error(`Error deleting review with id ${reviewId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
