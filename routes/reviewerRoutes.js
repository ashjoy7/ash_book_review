const express = require('express');
const router = express.Router();
const reviewerController = require('../controllers/reviewerController');

// Define routes relative to '/reviewers'
router.get('/', reviewerController.getAllReviewers);
router.get('/:reviewerId', reviewerController.getReviewerById);
router.post('/', reviewerController.createReviewer);
router.put('/:reviewerId', reviewerController.updateReviewer);
router.delete('/:reviewerId', reviewerController.deleteReviewer);

module.exports = router;
