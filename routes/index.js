const express = require('express');
const router = express.Router();

// Include routes for different endpoints
router.use('/swagger', require('./swagger'));
router.use('/books', require('./bookRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/authors', require('./authorRoutes'));
router.use('/genres', require('./genreRoutes')); // Corrected to use genreRoutes
router.use('/reviewers', require('./reviewerRoutes'));
router.use('/', require('./authRoutes'));

// Define a root endpoint handler
router.get('/', (req, res) => {
  res.send('Welcome to the Book Review API');
});

module.exports = router;