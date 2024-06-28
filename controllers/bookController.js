const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllBooks = async (req, res, next) => {
  const result = await mongodb.getDb().db().collection('books').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getBookById = async (req, res, next) => {
  const bookId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('books').find({ _id: bookId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

const createBook = async (req, res) => {
  const book = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    publishedYear: req.body.publishedYear,
    genre: req.body.genre,
    rating: req.body.rating
  };
  const response = await mongodb.getDb().db().collection('books').insertOne(book);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the book.');
  }
};

const updateBook = async (req, res) => {
  const bookId = new ObjectId(req.params.id);
  const book = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    publishedYear: req.body.publishedYear,
    genre: req.body.genre,
    rating: req.body.rating
  };
  const response = await mongodb.getDb().db().collection('books').replaceOne({ _id: bookId }, book);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the book.');
  }
};

const deleteBook = async (req, res) => {
  const bookId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('books').deleteOne({ _id: bookId });
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the book.');
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
