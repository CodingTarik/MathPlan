const express = require('express');
const router = express.Router();
const path = require('path');

// for modules and exam regulations
const dbController = require(
  path.join(__dirname, '../../controllers/databaseController.js')
);

// for pdf parser
const pdfUploadController = require(
  path.join(__dirname, '../../controllers/pdfUploadController.js')
);

// for exam regulations
router.post('/addExamRegulation', dbController.addOrUpdateExamRegulation);
router.get('/getAllExamRegulationsMin', dbController.getAllExamRegulationsMin);
router.post(
  '/deleteExamRegulationByName',
  dbController.deleteExamRegulationByName
);

// for modules
router.get('/getAllModuls', dbController.getAllModulsForJSONEditor);
router.get('/getAllModulsMin', dbController.getAllModulsMin);
router.post('/addModul', dbController.addModul);
router.post('/deleteModulById', dbController.deleteModulById);
router.delete('/deleteModule/:id', dbController.deleteModulById);
router.get(
  '/getModules/:id/:name/:credits/:language/:applicability',
  dbController.getModules
);
router.get('/getIncompleteModules', dbController.getIncompleteModules);
router.get('/getOneModule/:id', dbController.getOneModule);
router.put('/updateModule/:id', dbController.updateModule);

// for pdf parser
router.post('/uploadPDFtoServer', pdfUploadController.uploadPDF);

module.exports = router;
