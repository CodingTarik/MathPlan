const express = require('express');
const router = express.Router();
const path = require('path');

const dbController = require(
  path.join(__dirname, '../../controllers/databaseController.js')
);

router.get('/getAllModuls', dbController.getAllModulsForJSONEditor);
router.get('/getAllModulsMin', dbController.getAllModulsMin);
router.post('/addExamRegulation', dbController.addOrUpdateExamRegulation);
router.post('/addModul', dbController.addModul);
router.post('/deleteModulById', dbController.deleteModulById);
const pdfUploadController = require(
  path.join(__dirname, '../../controllers/pdfUploadController.js')
);
router.get('/getOneModule/:id', dbController.getOneModule);
router.put('/updateModule/:id', dbController.updateModule);
router.post('/deleteModuleById', dbController.deleteModuleById);
router.post('/uploadPDFtoServer', pdfUploadController.uploadPDF);
router.get('/getModules/:id/:name/:credits/:language/:applicability', dbController.getModules);

module.exports = router;
