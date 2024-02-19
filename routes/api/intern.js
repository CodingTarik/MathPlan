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
router.get('/getAllModuls', dbController.getAllModuls);
router.get('/getAllModulsMin', dbController.getAllModulsMin);
router.post('/addExamRegulation', dbController.addExamRegulation);
router.get('/getAllExamRegulationsMin', dbController.getAllExamRegulationsMin);
router.post('/deleteExamRegulationByName', dbController.deleteExamRegulationByName);
router.get(
  '/getModules/:id/:name/:credits/:language/:applicability',
  dbController.getModules
);

module.exports = router;
