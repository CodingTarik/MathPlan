const express = require('express');
const router = express.Router();
const path = require('path');

const dbController = require(
  path.join(__dirname, '../../controllers/databaseController.js')
);

const bookController = require(
  path.join(__dirname, '../../controllers/bookController.js')
);

// Example-API
router.get('/:title', bookController.handleGetBook);

router.post('/addModul', dbController.addModul);
router.get('/getOneModul/:id', dbController.getOneModul);
router.put('/updateModul/:id', dbController.updateModul);
router.post('/deleteModulById', dbController.deleteModulById);

router.get('/getModules/:id/:name/:credits/:language/:applicability', dbController.getModules);

module.exports = router;
