const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllGenres = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('genres').find().toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getGenreById = async (req, res) => {
  try {
    const genreId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('genres').findOne({ _id: genreId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createGenre = async (req, res) => {
  try {
    const genre = {
      name: req.body.name,
      description: req.body.description
    };
    const response = await mongodb.getDb().db().collection('genres').insertOne(genre);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateGenre = async (req, res) => {
  try {
    const genreId = new ObjectId(req.params.id);
    const genre = {
      name: req.body.name,
      description: req.body.description
    };
    const response = await mongodb.getDb().db().collection('genres').replaceOne({ _id: genreId }, genre);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Some error occurred while updating the genre.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteGenre = async (req, res) => {
  try {
    const genreId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('genres').deleteOne({ _id: genreId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Some error occurred while deleting the genre.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
};
