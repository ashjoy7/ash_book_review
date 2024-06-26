const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongodb = require('./db/connect');
const swaggerRoutes = require('./routes/swagger');
const passport = require('./auth');
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.use(session({
  secret: process.env.SECRET,  // Ensure SECRET is set in your environment variables
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

// Define your routes here
app.use('/', require('./routes'));

app.options('*', (req, res) => {
  res.status(200).send();
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});
