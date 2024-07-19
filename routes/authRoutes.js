const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to start OAuth authentication with Google
router.get('/auth/google', (req, res, next) => {
  console.log('Initiating Google OAuth Authentication');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Route to handle the OAuth callback
router.get('/auth/google/callback',
  (req, res, next) => {
    console.log('Handling Google OAuth Callback');
    passport.authenticate('google', { failureRedirect: '/' })(req, res, next);
  },
  (req, res) => {
    console.log('Google Authentication Successful');
    res.redirect('/');
  }
);

module.exports = router;
