const express = require('express');
const router = express.Router();

router.use('/swagger', require('./swagger'));
router.use('/books', require('./bookRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/authors', require('./authorRoutes'));
router.use('/genres', require('./genreRoutes'));
router.use('/reviewers', require('./reviewerRoutes'));
router.use('/', require('./authRoutes'));

module.exports = router;

router.get('/', (req, res) => {
  res.send('Welcome to the Book Review API');
});
