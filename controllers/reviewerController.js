const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Helper function to validate reviewer data
const validateReviewerData = (data) => {
  return data && typeof data.name === 'string' && typeof data.email === 'string';
};

// Get all reviewers
const getAllReviewers = async (req, res) => {
  try {
    const reviewers = await mongodb.getDb().db().collection('reviewers').find().toArray();
    res.status(200).json(reviewers);
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single reviewer by ID
const getReviewerById = async (req, res) => {
  const reviewerId = req.params.id;

  console.log('Received request to get reviewer with ID:', reviewerId);

  if (!ObjectId.isValid(reviewerId)) {
    console.log('Invalid ObjectId format:', reviewerId);
    return res.status(400).json({ error: 'Invalid reviewer ID' });
  }

  try {
    const reviewer = await mongodb.getDb().db().collection('reviewers').findOne({ _id: new ObjectId(reviewerId) });
    if (reviewer) {
      res.status(200).json(reviewer);
    } else {
      console.log('Reviewer not found for ID:', reviewerId);
      res.status(404).json({ error: 'Reviewer not found' });
    }
  } catch (error) {
    console.error(`Error fetching reviewer with id ${reviewerId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new reviewer
const createReviewer = async (req, res) => {
  const reviewer = {
    name: req.body.name,
    email: req.body.email,
  };

  console.log('Creating reviewer with data:', reviewer);

  if (!validateReviewerData(reviewer)) {
    console.log('Invalid reviewer data:', reviewer);
    return res.status(400).json({ error: 'Invalid reviewer data' });
  }

  try {
    const response = await mongodb.getDb().db().collection('reviewers').insertOne(reviewer);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      console.log('Error occurred while creating the reviewer:', response);
      res.status(500).json({ error: 'Some error occurred while creating the reviewer.' });
    }
  } catch (error) {
    console.error('Error creating reviewer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing reviewer
const updateReviewer = async (req, res) => {
  const reviewerId = req.params.id;
  const updateFields = {
    name: req.body.name,
    email: req.body.email,
  };

  console.log('Received request to update reviewer with ID:', reviewerId);
  console.log('Update data:', updateFields);

  if (!ObjectId.isValid(reviewerId)) {
    console.log('Invalid ObjectId format:', reviewerId);
    return res.status(400).json({ error: 'Invalid reviewer ID' });
  }

  if (!validateReviewerData(updateFields)) {
    console.log('Invalid reviewer data:', updateFields);
    return res.status(400).json({ error: 'Invalid reviewer data' });
  }

  try {
    const response = await mongodb.getDb().db().collection('reviewers').updateOne(
      { _id: new ObjectId(reviewerId) },
      { $set: updateFields }
    );

    if (response.modifiedCount > 0) {
      console.log('Reviewer updated successfully:', reviewerId);
      res.status(200).json(response);
    } else {
      console.log('Reviewer not found or no changes made for ID:', reviewerId);
      res.status(404).json({ error: 'Reviewer not found' });
    }
  } catch (error) {
    console.error(`Error updating reviewer with id ${reviewerId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a reviewer
const deleteReviewer = async (req, res) => {
  const reviewerId = req.params.id;

  console.log('Received request to delete reviewer with ID:', reviewerId);

  if (!ObjectId.isValid(reviewerId)) {
    console.log('Invalid ObjectId format:', reviewerId);
    return res.status(400).json({ error: 'Invalid reviewer ID' });
  }

  try {
    const response = await mongodb.getDb().db().collection('reviewers').deleteOne({ _id: new ObjectId(reviewerId) });

    if (response.deletedCount > 0) {
      console.log('Reviewer deleted successfully:', reviewerId);
      res.status(200).json(response);
    } else {
      console.log('Reviewer not found for ID:', reviewerId);
      res.status(404).json({ error: 'Reviewer not found' });
    }
  } catch (error) {
    console.error(`Error deleting reviewer with id ${reviewerId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllReviewers,
  getReviewerById,
  createReviewer,
  updateReviewer,
  deleteReviewer,
};
