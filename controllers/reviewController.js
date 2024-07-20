const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Helper function to validate review data
const validateReviewData = (data) => {
  return data &&
    typeof data.bookId === 'string' &&
    typeof data.reviewerId === 'string' &&
    typeof data.rating === 'number' &&
    typeof data.comment === 'string';
};

// Helper function to update the number of reviews for a book
const updateNumReviews = async (bookId) => {
  try {
    const reviewsCount = await mongodb.getDb().db().collection('reviews').countDocuments({ bookId: new ObjectId(bookId) });
    await mongodb.getDb().db().collection('books').updateOne(
      { _id: new ObjectId(bookId) },
      { $set: { numReviews: reviewsCount } }
    );
  } catch (error) {
    console.error('Error updating number of reviews:', error);
    throw new Error('Error updating number of reviews');
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

  if (!ObjectId.isValid(reviewId)) {
    return res.status(400).json({ error: 'Invalid review ID' });
  }

  try {
    const review = await mongodb.getDb().db().collection('reviews').findOne({ _id: new ObjectId(reviewId) });
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

  console.log('Creating review with data:', review); // Log review data

  if (!validateReviewData(review)) {
    return res.status(400).json({ error: 'Invalid review data' });
  }

  try {
    const response = await mongodb.getDb().db().collection('reviews').insertOne(review);
    if (response.acknowledged) {
      // Update the number of reviews for the book
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
    rating: req.body.rating,
    comment: req.body.comment,
    bookId: req.body.bookId, // Ensure bookId is included for updating numReviews
  };

  console.log('Updating review with id:', reviewId, 'and data:', updateFields); // Log review ID and update fields

  // Validate reviewId
  if (!ObjectId.isValid(reviewId)) {
    return res.status(400).json({ error: 'Invalid review ID' });
  }

  // Validate review data
  if (!validateReviewData({ ...updateFields, bookId: req.body.bookId })) {
    return res.status(400).json({ error: 'Invalid review data' });
  }

  try {
    const response = await mongodb.getDb().db().collection('reviews').updateOne(
      { _id: new ObjectId(reviewId) }, // Correctly instantiate ObjectId
      { $set: updateFields }
    );
    if (response.modifiedCount > 0) {
      // Update the number of reviews for the book if the bookId is provided
      if (updateFields.bookId) {
        await updateNumReviews(updateFields.bookId);
      }
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
    const review = await mongodb.getDb().db().collection('reviews').findOne({ _id: new ObjectId(reviewId) });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    const response = await mongodb.getDb().db().collection('reviews').deleteOne({ _id: new ObjectId(reviewId) });
    if (response.deletedCount > 0) {
      // Update the number of reviews for the book
      await updateNumReviews(review.bookId);
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
