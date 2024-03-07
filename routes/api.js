const express = require('express');
const router = express.Router();
const path = require('path');
const internAPI = require(path.join(__dirname, 'api/intern.js'));
const studentAPI = require(path.join(__dirname, 'api/student.js'));
const checkRole = require(path.join(__dirname, '../auth/roleChecker.js')).checkRole;
// Routing
router.use('/intern', checkRole('intern'), internAPI);
router.use('/student', checkRole('student'), studentAPI);

module.exports = router;
