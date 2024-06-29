const { getDb } = require('../db/connect');

// Get all reviews
const getAllReviews = async (req, res, next) => {
  try {
    const db = getDb();
    const reviews = await db.collection('Reviews').find().toArray();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// Get review by ID
const getReviewById = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  try {
    const db = getDb();
    const review = await db.collection('Reviews').findOne({ reviewId });
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
    } else {
      res.json(review);
    }
  } catch (error) {
    next(error);
  }
};

// Create a new review
const createReview = async (req, res, next) => {
  const { bookId, reviewerId, rating, reviewText, createdAt, updatedAt } = req.body;
  try {
    const db = getDb();
    const result = await db.collection('Reviews').insertOne({
      bookId,
      reviewerId,
      rating,
      reviewText,
      createdAt,
      updatedAt,
    });
    res.status(201).json(result.ops[0]);
  } catch (error) {
    next(error);
  }
};

// Update a review by ID
const updateReview = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const updateFields = req.body;
  try {
    const db = getDb();
    const result = await db.collection('Reviews').updateOne({ reviewId }, { $set: updateFields });
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: 'Review not found' });
    } else {
      res.json({ message: 'Review updated successfully' });
    }
  } catch (error) {
    next(error);
  }
};

// Delete a review by ID
const deleteReview = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  try {
    const db = getDb();
    const result = await db.collection('Reviews').deleteOne({ reviewId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Review not found' });
    } else {
      res.json({ message: 'Review deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
