const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(400).json({
    success: false,
    message: "Cannot GET /api/v1"
  });
});

module.exports = router;
