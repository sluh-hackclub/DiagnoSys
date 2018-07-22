const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');

const Doctor = require('../models/doctor.js');


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

module.exports = router;
