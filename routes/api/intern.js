const express = require('express');
const router = express.Router();
const path = require('path');

const dbController = require(
  path.join(__dirname, '../../controllers/databaseController.js')
);

const bookController = require(
  path.join(__dirname, '../../controllers/bookController.js')
);

router.post('/addModul', dbController.addModul);
router.post('/deleteModulById', dbController.deleteModulById);
router.get('/getAllModuls', dbController.getAllModuls);

// Example-API
router.get('/:title', bookController.handleGetBook);

module.exports = router;
