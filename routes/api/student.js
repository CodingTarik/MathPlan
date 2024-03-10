const express = require('express');
const router = express.Router();
const path = require('path');

// for exam plans
const dbController = require(
  path.join(__dirname, '../../controllers/databaseController.js')
);

// for exam plans
router.post('/addExamPlan', dbController.addExamPlan);

module.exports = router;
