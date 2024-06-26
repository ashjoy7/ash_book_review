const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to start OAuth authentication with Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route to handle the OAuth callback
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to your desired route
    res.redirect('/');
  }
);

module.exports = router;
