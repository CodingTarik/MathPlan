const express = require('express');
const router = express.Router();
const path = require('path');
const dbController = require(path.join(__dirname, '../controllers/databaseController.js'));

const bookController = require(
  path.join(__dirname, '../controllers/bookController.js')
);

// Example-API
router.get('/:title', bookController.handleGetBook);

router.post('/addModul', dbController.addModul);

module.exports = router;
