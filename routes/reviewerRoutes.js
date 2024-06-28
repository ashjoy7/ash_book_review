const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Route to get all reviews associated with a specific book
router.get('/books/:bookId/reviews', reviewController.getAllReviews);

// Route to get a specific review by its ID
router.get('/reviews/:reviewId', reviewController.getReviewsById);

// Route to create a new review
router.post('/books/:bookId/reviews', reviewController.createReview);

// Route to update a review by its ID
router.put('/:reviewId', reviewController.updateReview);

// Route to delete a review by its ID
router.delete('/reviews/:reviewId', reviewController.deleteReview);

module.exports = router;
