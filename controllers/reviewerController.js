const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllReviewers = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('reviewers').find().toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getReviewerById = async (req, res) => {
  try {
    const reviewerId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('reviewers').findOne({ _id: reviewerId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createReviewer = async (req, res) => {
  try {
    const reviewer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    };
    const response = await mongodb.getDb().db().collection('reviewers').insertOne(reviewer);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateReviewer = async (req, res) => {
  try {
    const reviewerId = new ObjectId(req.params.id);
    const reviewer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    };
    const response = await mongodb.getDb().db().collection('reviewers').replaceOne({ _id: reviewerId }, reviewer);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Some error occurred while updating the reviewer.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteReviewer = async (req, res) => {
  try {
    const reviewerId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('reviewers').deleteOne({ _id: reviewerId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Some error occurred while deleting the reviewer.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllReviewers,
  getReviewerById,
  createReviewer,
  updateReviewer,
  deleteReviewer
};
