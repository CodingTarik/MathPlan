const express = require('express');
const router = express.Router();
const path = require('path');
const db = require(path.join(__dirname, "../database/database.js"));

const bookController = require(
  path.join(__dirname, '../controllers/bookController.js')
);

// Example-API
router.get('/:title', bookController.handleGetBook);

router.post("/addModul", db.addModul)

module.exports = router;
