const express = require('express');
const router = express.Router();
const reviewerController = require('../controllers/reviewerController');

// Reviewer routes
router.get('/reviewers', reviewerController.getAllReviewers);
router.get('/reviewers/:reviewerId', reviewerController.getReviewerById);
router.post('/reviewers', reviewerController.createReviewer);
router.put('/reviewers/:reviewerId', reviewerController.updateReviewer);
router.delete('/reviewers/:reviewerId', reviewerController.deleteReviewer);

module.exports = router;
