const express = require('express');
const path = require('path');
const router = express.Router();
//const data = require(path.join(__dirname, "../database/database.js"))

router.get('/', (req, res, next) => {
  res.render('layout/index', {
    body: '../pages/startpage.ejs',
    title: 'Startseite'
  });
});

const internPath = path.join(__dirname, '..', 'client', 'build', 'intern');
console.log('Intern Path:', internPath);

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

// 404 not found
router.get('*', function (req, res) {
  res.status(404).render('layout/index', {
    body: '../pages/notfound.ejs'
  });
});
module.exports = router;
