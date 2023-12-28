const path = require('path');
const db = require(path.join(__dirname, '../database/database.js'));

const addModul = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
    return;
  }
  db.addModul(req.body.id, req.body.name, req.body.credits, req.body.language, req.body.applicability)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
            err.message || 'Fehler beim Hinzufügen des Moduls'
      });
    });
};

module.exports = {
  addModul
};
