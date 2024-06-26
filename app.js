require('dotenv').config();

console.log('SECRET:', process.env.SECRET); // Log the SECRET to verify

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongodb = require('./db/connect');
const swaggerRoutes = require('./routes/swagger');
const passport = require('./auth');

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

// Routes
app.use('/', require('./routes')); // Your API routes

// Swagger UI setup
app.use('/api-docs', swagger.js); // Assumes swaggerRoutes handles Swagger UI

// Initialize MongoDB connection
mongodb.initDb((err) => {
  if (err) {
    console.error('MongoDB connection error:', err);
  } else {
    // Start server
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});
