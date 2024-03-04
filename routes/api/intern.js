const express = require('express');
const router = express.Router();
const path = require('path');

const dbController = require(
  path.join(__dirname, '../../controllers/databaseController.js')
);

router.post('/addModul', dbController.addModul);
router.post('/deleteModulById', dbController.deleteModulById);

router.get(
  '/getModules/:id/:name/:credits/:language/:applicability',
  dbController.getModules
);
router.get('/getIncompleteModules', dbController.getIncompleteModules);

module.exports = router;
