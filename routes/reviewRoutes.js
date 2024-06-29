const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Define routes relative to '/reviews'
router.get('/', reviewController.getAllReviews);
router.get('/:reviewId', reviewController.getReviewById);
router.post('/', reviewController.createReview);
router.put('/:reviewId', reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;