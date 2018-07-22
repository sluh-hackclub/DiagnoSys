const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Doctor = require('./models/doctor.js');

const baseRoute = require('./routes/base.js');
const loginRoute = require('./routes/login.js');
// const testRoute = require('./routes/test.js')

// router.use('/test', testRoute);
router.use('/', baseRoute);
// router.use('/login', loginRoute);

function checkAuth(req, res, next) {
  if (req.session.email) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Not authorized"
    });
  }
}

router.post('/login', (req, res, next) => {
  console.log(req.body);
  console.log(typeof req.body)
  if (req.body['email'] && req.body['password']) {
    if (req.body['password'] === 'hunter2') {
      req.session.email = req.body['email'];
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  }
});

router.get('/test', checkAuth, (req, res) => {
  res.status(200).json({
    success: true
  });
});


router.post('/', (req, res, next) => {
  console.log(req.body);
  console.log(typeof req.body)
  if (req.body['email'] && req.body['password']) {
    if (req.body['password'] === 'hunter2') {
      req.session.email = req.body['email']
    }
  }
  res.status(500).json({});
});

router.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

router.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = router;
