const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await mongodb.getDb().db().collection('reviews').find().toArray();
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json('Internal Server Error');
  }
};

// Get a single review by ID
const getReviewById = async (req, res) => {
  const reviewId = req.params.id;
  try {
    const review = await mongodb.getDb().db().collection('reviews').findOne({ _id: ObjectId(reviewId) });
    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json('Review not found');
    }
  } catch (error) {
    console.error(`Error fetching review with id ${reviewId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

// Create a new review for a book
const createReview = async (req, res) => {
  const review = {
    bookId: ObjectId(req.params.bookId),
    reviewerId: ObjectId(req.body.reviewerId),
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

// Update an existing review
const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const updateFields = {
    rating: req.body.rating,
    reviewText: req.body.reviewText,
    updatedAt: new Date(),
  };

  try {
    const response = await mongodb.getDb().db().collection('reviews').updateOne(
      { _id: ObjectId(reviewId) },
      { $set: updateFields }
    );
    if (response.modifiedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json('Review not found');
    }
  } catch (error) {
    console.error(`Error updating review with id ${reviewId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  try {
    const response = await mongodb.getDb().db().collection('reviews').deleteOne({ _id: ObjectId(reviewId) });
    if (response.deletedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json('Review not found');
    }
  } catch (error) {
    console.error(`Error deleting review with id ${reviewId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
