const express = require('express');
const router = express.Router();
const path = require('path');

const dbController = require(
  path.join(__dirname, '../../controllers/databaseController.js')
);

const bookController = require(
  path.join(__dirname, '../../controllers/bookController.js')
);

// const pdfUploaderController = require(
//  path.join(__dirname, '../../controllers/pdfUploaderController.js')
// );

// Example-API
router.get('/:title', bookController.handleGetBook);

router.post('/addModul', dbController.addModul);
router.post('/deleteModulById', dbController.deleteModulById);

// router.post('/uploadPDF', pdfUploaderController.uploadPDF);

module.exports = router;
