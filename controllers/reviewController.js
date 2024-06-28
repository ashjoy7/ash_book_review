const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllReviews = async (req, res, next) => {
  const bookId = req.params.bookId; // Correctly extract bookId from request parameters
  try {
    const result = await mongodb.getDb().db().collection('reviews').find({ bookId: new ObjectId(bookId) }).toArray();
    res.status(200).json(result);
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
    const bookExists = await mongodb.getDb().db().collection('books').findOne({ _id: new ObjectId(bookId) });
    if (!bookExists) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const review = {
      reviewer,
      content,
      rating,
      bookId: new ObjectId(bookId) // Ensure bookId is stored as ObjectId
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
  const bookId = new ObjectId(req.params.id); // Extract bookId from request parameters
  try {
    const result = await mongodb.getDb().db().collection('reviews').find({ bookId }).toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateReview = async (req, res) => {
  const reviewId = new ObjectId(req.params.reviewId); // Correctly extract reviewId
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
    const response = await mongodb.getDb().db().collection('reviews').replaceOne({ _id: reviewId }, updatedReview);
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
  const reviewId = new ObjectId(req.params.id);
  try {
    const response = await mongodb.getDb().db().collection('reviews').deleteOne({ _id: reviewId });
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
