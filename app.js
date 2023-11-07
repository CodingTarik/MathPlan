const express = require('express');
const app = express();
const port = 3000;
const ejs = require('ejs');
const path = require('path');

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', { title: 'index' });
});

app.get('/about', (req, res) => {
  res.render('index', { title: 'Über uns' });
});

app.listen(port, () => {
  console.log(`Die Anwendung ist auf http://localhost:${port} verfügbar.`);
});
