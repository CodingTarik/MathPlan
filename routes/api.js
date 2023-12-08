const express = require('express');
const router = express.Router();
const path = require('path');

const bookController = require(
  path.join(__dirname, '../controllers/bookController.js')
);

// Example-API
router.get('/:title', bookController.handleGetBook);

module.exports = router;
