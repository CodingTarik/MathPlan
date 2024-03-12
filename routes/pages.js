const express = require('express');
const path = require('path');
const router = express.Router();
const checkRole = require(path.join(__dirname, '../auth/roleChecker.js')).checkRole;

router.get('/', (req, res, next) => {
  res.render('layout/index', {
    body: '../pages/startpage.ejs',
    title: 'Startseite'
  });
});

router.get('/teach', checkRole('teacher'), (req, res, next) => {
  res.render('layout/index', {
    body: '../pages/teach.ejs',
    title: 'Dozierende'
  });
});

const internPath = path.join(__dirname, '..', 'client', 'build', 'intern');

router.get('/intern', checkRole('intern'), (req, res, next) => {
  res.render('layout/index', {
    body: '../../client/build/intern/index.html',
    title: 'Intern'
  });
});

router.use(
  '/intern',
  checkRole('intern'),
  express.static(internPath, { index: false, redirect: false })
);

// when the idp is not reachable
router.get('/loginnotworking', (req, res) => {
  res.render('layout/index', {
    body: '../pages/nologinpossible.ejs'
  });
});

// when the user has no access to the requested page
router.get('/noaccess', (req, res) => {
  res.render('layout/index', {
    body: '../pages/noaccess.ejs'
  });
});

const studentPath = path.join(__dirname, '..', 'client', 'build', 'student');

router.get('/student',checkRole('student'), (req, res, next) => {
  res.render('layout/index', { body: '../../client/build/student/index.html' });
});
router.use(
  '/student',
  checkRole('student'),
  express.static(studentPath, { index: false, redirect: false })
);

// 404 not found
router.get('*', function (req, res) {
  res.status(404).render('layout/index', {
    body: '../pages/notfound.ejs'
  });
});

module.exports = router;
