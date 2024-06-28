const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/books/:bookId/reviews', reviewController.getAllReviews);
router.get('/reviews/:reviewId', reviewController.getReviewsById);
router.post('/books/:bookId/reviews', reviewController.createReview);
router.put('/:reviewId', reviewController.updateReview);
router.delete('/reviews/:reviewId', reviewController.deleteReview);

module.exports = router;
