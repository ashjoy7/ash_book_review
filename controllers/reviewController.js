const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Helper function to check if an ObjectId is valid
const isValidObjectId = (id) => {
  return ObjectId.isValid(id);
};

// Helper function to update reviewer's reviews field
const updateReviewerReviews = async (reviewerId, reviewId) => {
  if (isValidObjectId(reviewerId) && isValidObjectId(reviewId)) {
    await mongodb.getDb().db().collection('reviewers').updateOne(
      { _id: ObjectId(reviewerId) },
      { $addToSet: { reviews: ObjectId(reviewId) } }
    );
  }
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

  if (!isValidObjectId(reviewId)) {
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
  const { bookId, reviewerId, rating, comment } = req.body;

  if (!isValidObjectId(bookId) || !isValidObjectId(reviewerId)) {
    return res.status(400).json({ error: 'Invalid book ID or reviewer ID' });
  }

  try {
    const newReview = {
      bookId: ObjectId(bookId),
      reviewerId: ObjectId(reviewerId),
      rating,
      comment,
    };

    const response = await mongodb.getDb().db().collection('reviews').insertOne(newReview);
    if (response.acknowledged) {
      await updateReviewerReviews(reviewerId, response.insertedId);
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
  const { bookId, reviewerId, rating, comment } = req.body;

  if (!isValidObjectId(reviewId) || !isValidObjectId(reviewerId) || !isValidObjectId(bookId)) {
    return res.status(400).json({ error: 'Invalid IDs' });
  }

  try {
    const response = await mongodb.getDb().db().collection('reviews').updateOne(
      { _id: ObjectId(reviewId) },
      { $set: { bookId: ObjectId(bookId), reviewerId: ObjectId(reviewerId), rating, comment } }
    );

    if (response.modifiedCount > 0) {
      // Ensure reviewer field is updated if needed
      await updateReviewerReviews(reviewerId, reviewId);
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

  if (!isValidObjectId(reviewId)) {
    return res.status(400).json({ error: 'Invalid review ID' });
  }

  try {
    const review = await mongodb.getDb().db().collection('reviews').findOne({ _id: ObjectId(reviewId) });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Remove the review
    const response = await mongodb.getDb().db().collection('reviews').deleteOne({ _id: ObjectId(reviewId) });
    if (response.deletedCount > 0) {
      // Remove the review ID from the reviewer's reviews field
      await mongodb.getDb().db().collection('reviewers').updateOne(
        { _id: ObjectId(review.reviewerId) },
        { $pull: { reviews: ObjectId(reviewId) } }
      );
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
