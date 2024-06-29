const { getDb } = require('../db/connect');

// Get all reviewers
const getAllReviewers = async (req, res, next) => {
  try {
    const db = getDb();
    const reviewers = await db.collection('Reviewers').find().toArray();
    res.json(reviewers);
  } catch (error) {
    next(error);
  }
};

// Get reviewer by ID
const getReviewerById = async (req, res, next) => {
  const reviewerId = req.params.reviewerId;
  try {
    const db = getDb();
    const reviewer = await db.collection('Reviewers').findOne({ reviewerId });
    if (!reviewer) {
      res.status(404).json({ message: 'Reviewer not found' });
    } else {
      res.json(reviewer);
    }
  } catch (error) {
    next(error);
  }
};

// Create a new reviewer
const createReviewer = async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  try {
    const db = getDb();
    const result = await db.collection('Reviewers').insertOne({
      firstName,
      lastName,
      email,
    });
    res.status(201).json(result.ops[0]);
  } catch (error) {
    next(error);
  }
};

// Update a reviewer by ID
const updateReviewer = async (req, res, next) => {
  const reviewerId = req.params.reviewerId;
  const updateFields = req.body;
  try {
    const db = getDb();
    const result = await db.collection('Reviewers').updateOne({ reviewerId }, { $set: updateFields });
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: 'Reviewer not found' });
    } else {
      res.json({ message: 'Reviewer updated successfully' });
    }
  } catch (error) {
    next(error);
  }
};

// Delete a reviewer by ID
const deleteReviewer = async (req, res, next) => {
  const reviewerId = req.params.reviewerId;
  try {
    const db = getDb();
    const result = await db.collection('Reviewers').deleteOne({ reviewerId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Reviewer not found' });
    } else {
      res.json({ message: 'Reviewer deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviewers,
  getReviewerById,
  createReviewer,
  updateReviewer,
  deleteReviewer,
};
