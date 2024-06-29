const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const reviewController = require('../controllers/reviewController');

// Review routes
router.get('/reviews', reviewController.getAllReviews);
router.get('/reviews/:reviewId', reviewController.getReviewById);
router.post('/reviews', reviewController.createReview);
router.put('/reviews/:reviewId', reviewController.updateReview);
router.delete('/reviews/:reviewId', reviewController.deleteReview);

module.exports = router;
