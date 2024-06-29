const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

// Define routes relative to '/authors'
router.get('/', authorController.getAllAuthors);
router.get('/:authorId', authorController.getAuthorById);
router.post('/', authorController.createAuthor);
router.put('/:authorId', authorController.updateAuthor);
router.delete('/:authorId', authorController.deleteAuthor);

module.exports = router;
