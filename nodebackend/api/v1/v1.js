const express = require('express');
const router = express.Router();

const baseRoute = require('./routes/base.js')

router.use('/', baseRoute);

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
