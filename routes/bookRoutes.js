const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Book routes
router.get('/books', bookController.getAllBooks);
router.get('/books/:bookId', bookController.getBookById);
router.post('/books', bookController.createBook);
router.put('/books/:bookId', bookController.updateBook);
router.delete('/books/:bookId', bookController.deleteBook);

module.exports = router;
