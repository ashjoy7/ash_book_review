const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

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

module.exports = {
  createReviewer,
};
