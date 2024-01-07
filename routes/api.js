const express = require('express');
const router = express.Router();
const path = require('path');
const internAPI = require(path.join(__dirname, 'api/intern.js'));
const studentAPI = require(path.join(__dirname, 'api/student.js'));

// Routing
router.use('/intern', internAPI);
router.use('/student', studentAPI);

// Module-API
router.get('/module/getmodules', moduleController.getAllModules);

module.exports = router;
