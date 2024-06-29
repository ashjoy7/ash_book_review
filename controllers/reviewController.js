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
  const { bookId } = req.params;

  try {
    // Check if bookId is a valid ObjectId
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid bookId format' });
    }

    // Check if the book with the specified _id exists
    const bookExists = await mongodb.getDb().db().collection('books').findOne({ _id: new ObjectId(bookId) });
    if (!bookExists) {
      console.log(`Book with ID ${bookId} not found`);
      return res.status(404).json({ error: 'Book not found' });
    }

    // Construct the review object
    const review = {
      reviewer,
      content,
      rating,
      bookId: new ObjectId(bookId) // Link review to the specific book
    };

    // Insert the review into the 'reviews' collection
    const response = await mongodb.getDb().db().collection('reviews').insertOne(review);
    
    // Respond with the inserted review
    res.status(201).json(response.ops[0]);
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
