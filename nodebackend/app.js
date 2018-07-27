const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');

const apiV1 = require('./api/v1/v1.js');

const acceptedDbTypes = ['mongodb'];

dotenv.load({ path: '.env' });

// check if the current db type is acceptable (in the array)
if (acceptedDbTypes.indexOf(process.env.DB_TYPE) !== -1) {
  if (process.env.DB_TYPE === 'mongodb') {
    // check for required env variables
    if (process.env.MONGO_HOST && process.env.MONGO_USER && process.env.MONGO_PW && process.env.MONGO_DB) {
      mongoose.connect('mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PW + '@' + process.env.MONGO_HOST + '/' + process.env.MONGO_DB + '?retryWrites=true').then(() => {
        console.log('Database connected');
      }).catch(err => {
        console.error('Database connection error');
        console.error(err);
      });
    } else {
      console.log('MongoDB selected as DB_TYPE but missing env variables.');
      process.exit(1);
    }
  } else {
    // this won't happen but this is where other db cases go
  }
} else {
  console.log('Unacceptable DB type');
  process.exit(1);
}

// log requests in console
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

if (process.env.SESSION_SECRET) {
  app.use(session({
    secret: process.env.SESSION_SECRET
  }));
} else {
  console.log('Missing env var SESSION_SECRET');
  process.exit(1);
}

// Send CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    // amend with all allowed HTTP methods
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.use('/api/v1', apiV1);

app.use(express.static(path.join(__dirname, '/frontend'), {
  extensions: ['html']
}));

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.sendFile(path.join(__dirname, './static', '404.html'));
});

module.exports = app;
