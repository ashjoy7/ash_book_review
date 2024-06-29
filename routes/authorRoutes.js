const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

router.get('/authors', authorController.getAllAuthors);
router.get('/authors/:authorId', authorController.getAuthorById);
router.post('/authors', authorController.createAuthor);
router.put('/authors/:authorId', authorController.updateAuthor);
router.delete('/authors/:authorId', authorController.deleteAuthor);

module.exports = router;
