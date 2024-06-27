const express = require('express');
const router = express.Router();

router.use('/swagger', require('./swagger'));
router.use('/books', require('./bookRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/', require('./authRoutes'));

// Export the router first
module.exports = router;

// Define your root endpoint handler after exporting the router
router.get('/', (req, res) => {
  res.send('Welcome to the Book Review API');
});
