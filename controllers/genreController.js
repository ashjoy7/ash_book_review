const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Helper function to validate genre data
const validateGenreData = (data) => {
  return data && typeof data.genreName === 'string' && typeof data.genreDescription === 'string';
};

// Get all genres
const getAllGenres = async (req, res) => {
  try {
    const genres = await mongodb.getDb().db().collection('genres').find().toArray();
    res.status(200).json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single genre by ID
const getGenreById = async (req, res) => {
  const genreId = req.params.id;

  if (!ObjectId.isValid(genreId)) {
    return res.status(400).json({ error: 'Invalid genre ID' });
  }

  try {
    const genre = await mongodb.getDb().db().collection('genres').findOne({ _id: new ObjectId(genreId) });
    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(404).json({ error: 'Genre not found' });
    }
  } catch (error) {
    console.error(`Error fetching genre with id ${genreId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new genre
const createGenre = async (req, res) => {
  const genre = {
    genreName: req.body.genreName,
    genreDescription: req.body.genreDescription,
  };

  if (!validateGenreData(genre)) {
    return res.status(400).json({ error: 'Invalid genre data' });
  }

  try {
    const response = await mongodb.getDb().db().collection('genres').insertOne(genre);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the genre.' });
    }
  } catch (error) {
    console.error('Error creating genre:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing genre
const updateGenre = async (req, res) => {
  const genreId = req.params.id;
  const updateFields = {
    genreName: req.body.genreName,
    genreDescription: req.body.genreDescription,
  };

  if (!ObjectId.isValid(genreId)) {
    return res.status(400).json({ error: 'Invalid genre ID' });
  }

  if (!validateGenreData(updateFields)) {
    return res.status(400).json({ error: 'Invalid genre data' });
  }

  try {
    const response = await mongodb.getDb().db().collection('genres').updateOne(
      { _id: new ObjectId(genreId) },
      { $set: updateFields }
    );
    if (response.modifiedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'Genre not found' });
    }
  } catch (error) {
    console.error(`Error updating genre with id ${genreId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a genre
const deleteGenre = async (req, res) => {
  const genreId = req.params.id;

  if (!ObjectId.isValid(genreId)) {
    return res.status(400).json({ error: 'Invalid genre ID' });
  }

  try {
    const response = await mongodb.getDb().db().collection('genres').deleteOne({ _id: new ObjectId(genreId) });
    if (response.deletedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'Genre not found' });
    }
  } catch (error) {
    console.error(`Error deleting genre with id ${genreId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
};
