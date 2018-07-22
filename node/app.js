const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');

const apiV1 = require('./api/v1/v1.js');

// log requests in console
app.use(morgan('dev'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

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

app.use(express.static('./frontend', {
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
