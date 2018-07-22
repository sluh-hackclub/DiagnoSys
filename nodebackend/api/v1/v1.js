const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Doctor = require('./models/doctor.js');
const Case = require('./models/case.js');

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
  console.log(typeof req.body);
  if (req.body['email'] && req.body['password']) {
    if (req.body['password'] === 'hunter2') {
      req.session.email = req.body['email'];
      res.redirect('/dashboard');
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});

router.post('/create_case', checkAuth, (req, res, next) => {
  if (typeof req.body === 'object' && req.body.primary_doctor && req.body.symptoms && typeof req.body.primary_doctor === 'string' && typeof req.body.symptoms === 'object') {
    console.log('Good request');
    console.log(req.session.email);
    let newCase = new Case({
      primary_doctor: req.body.primary_doctor,
      symptoms: req.body.symptoms
    });
    newCase.save().then(doc => {
      console.log(doc);
      res.status(200).json({
        success: true,
        caseId: doc['_id']
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Bad request'
  });
  }
});

router.get('/check_login', checkAuth, (req, res) => {
  res.status(200).json({
    success: true
  });
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
