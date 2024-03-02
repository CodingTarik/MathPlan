const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('layout/index', {
    body: '../pages/startpage.ejs',
    title: 'Startseite'
  });
});

router.get('/teach', (req, res, next) => {
  res.render('layout/index', {
    body: '../pages/teach.ejs',
    title: 'Dozierende'
  });
});

const internPath = path.join(__dirname, '..', 'client', 'build', 'intern');

router.get('/intern', (req, res, next) => {
  res.render('layout/index', { body: '../../client/build/intern/index.html' });
});
router.use(
  '/intern',
  express.static(internPath, { index: false, redirect: false })
);

router.get('/about/:name', (req, res) => {
  // Übergeben von Parameter Name an Seitenrenderer
  res.render('index', { title: `Über uns ${req.params.name}` });
});

const studentPath = path.join(__dirname, '..', 'client', 'build', 'student');

router.get('/student', (req, res, next) => {
  res.render('layout/index', { body: '../../client/build/student/index.html' });
});
router.use(
  '/student',
  express.static(studentPath, { index: false, redirect: false })
);

// 404 not found
router.get('*', function (req, res) {
  res.status(404).render('layout/index', {
    body: '../pages/notfound.ejs'
  });
});

module.exports = router;
