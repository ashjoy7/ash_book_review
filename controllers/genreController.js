const { getDb } = require('../db/connect');

// Get all genres
const getAllGenres = async (req, res, next) => {
  try {
    const db = getDb();
    const genres = await db.collection('Genres').find().toArray();
    res.json(genres);
  } catch (error) {
    next(error);
  }
};

// Get genre by ID
const getGenreById = async (req, res, next) => {
  const genreId = req.params.genreId;
  try {
    const db = getDb();
    const genre = await db.collection('Genres').findOne({ genreId });
    if (!genre) {
      res.status(404).json({ message: 'Genre not found' });
    } else {
      res.json(genre);
    }
  } catch (error) {
    next(error);
  }
};

// Create a new genre
const createGenre = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const db = getDb();
    const result = await db.collection('Genres').insertOne({
      name,
      description,
    });
    res.status(201).json(result.ops[0]);
  } catch (error) {
    next(error);
  }
};

// Update a genre by ID
const updateGenre = async (req, res, next) => {
  const genreId = req.params.genreId;
  const updateFields = req.body;
  try {
    const db = getDb();
    const result = await db.collection('Genres').updateOne({ genreId }, { $set: updateFields });
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: 'Genre not found' });
    } else {
      res.json({ message: 'Genre updated successfully' });
    }
  } catch (error) {
    next(error);
  }
};

// Delete a genre by ID
const deleteGenre = async (req, res, next) => {
  const genreId = req.params.genreId;
  try {
    const db = getDb();
    const result = await db.collection('Genres').deleteOne({ genreId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Genre not found' });
    } else {
      res.json({ message: 'Genre deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
};
