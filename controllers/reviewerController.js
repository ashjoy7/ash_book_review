const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Get all reviewers
const getAllReviewers = async (req, res) => {
  try {
    const reviewers = await mongodb.getDb().db().collection('reviewers').find().toArray();
    res.status(200).json(reviewers);
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    res.status(500).json('Internal Server Error');
  }
};

// Get a single reviewer by ID
const getReviewerById = async (req, res) => {
  const reviewerId = req.params.id;
  try {
    const reviewer = await mongodb.getDb().db().collection('reviewers').findOne({ _id: ObjectId(reviewerId) });
    if (reviewer) {
      res.status(200).json(reviewer);
    } else {
      res.status(404).json('Reviewer not found');
    }
  } catch (error) {
    console.error(`Error fetching reviewer with id ${reviewerId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

// Create a new reviewer
const createReviewer = async (req, res) => {
  const reviewer = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  try {
    const response = await mongodb.getDb().db().collection('reviewers').insertOne(reviewer);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the reviewer.');
    }
  } catch (error) {
    console.error('Error creating reviewer:', error);
    res.status(500).json('Internal Server Error');
  }
};

// Update an existing reviewer
const updateReviewer = async (req, res) => {
  const reviewerId = req.params.id;
  const updateFields = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  try {
    const response = await mongodb.getDb().db().collection('reviewers').updateOne(
      { _id: ObjectId(reviewerId) },
      { $set: updateFields }
    );
    if (response.modifiedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json('Reviewer not found');
    }
  } catch (error) {
    console.error(`Error updating reviewer with id ${reviewerId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

// Delete a reviewer
const deleteReviewer = async (req, res) => {
  const reviewerId = req.params.id;
  try {
    const response = await mongodb.getDb().db().collection('reviewers').deleteOne({ _id: ObjectId(reviewerId) });
    if (response.deletedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json('Reviewer not found');
    }
  } catch (error) {
    console.error(`Error deleting reviewer with id ${reviewerId}:`, error);
    res.status(500).json('Internal Server Error');
  }
};

module.exports = {
  getAllReviewers,
  getReviewerById,
  createReviewer,
  updateReviewer,
  deleteReviewer,
};
