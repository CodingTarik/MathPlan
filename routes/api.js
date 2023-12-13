const express = require('express');
const router = express.Router();
const path = require('path');
const bookController = require(
  path.join(__dirname, '../controllers/bookController.js')
);
const moduleController = require(
  path.join(__dirname, '../controllers/moduleController.js')
);

// Example-API
router.get('/:title', bookController.handleGetBook);

// Module-API
router.get('/module/getmodules', moduleController.getAllModules);

module.exports = router;
