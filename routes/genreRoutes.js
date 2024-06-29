const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');

// Genre routes
router.get('/genres', genreController.getAllGenres);
router.get('/genres/:genreId', genreController.getGenreById);
router.post('/genres', genreController.createGenre);
router.put('/genres/:genreId', genreController.updateGenre);
router.delete('/genres/:genreId', genreController.deleteGenre);

module.exports = router;
