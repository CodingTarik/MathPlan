const express = require('express');
const router = express.Router();
const path = require('path');

const dbController = require(
  path.join(__dirname, '../../controllers/databaseController.js')
);

const pdfUploadController = require(
  path.join(__dirname, '../../controllers/pdfUploadController.js')
);

router.post('/addModule', dbController.addModule);
router.get('/getOneModule/:id', dbController.getOneModule);
router.put('/updateModule/:id', dbController.updateModule);
router.post('/deleteModuleById', dbController.deleteModuleById);

router.post('/uploadPDFtoServer', pdfUploadController.uploadPDF);

router.get('/getModules/:id/:name/:credits/:language/:applicability', dbController.getModules);
router.delete('/deleteModule/:id', dbController.deleteModulById);

module.exports = router;
