const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.SECRET,
      callbackURL: 'https://ash-book-review.onrender.com/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Google Strategy Callback - Profile:', profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Serializing User:', user);
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  console.log('Deserializing User:', obj);
  done(null, obj);
});

module.exports = passport;
