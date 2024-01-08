const path = require('path');
const db = require(path.join(__dirname, '../database/database.js'));

/**
 * if a request is made the addModul function of the database is called by the controller and the added module is sent back as a response
 * @param  req
 * @param  res
 * @returns if the passed data is not sufficient as in does not contain a module id
 */
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
            err.message || 'Error adding module!'
      });
    });
};

/**
 * If a request is made, the deleteModulById function of the database is called by the controller,
 * and a response is sent based on the success or failure of the deletion.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void} - Sends a response based on the success or failure of the deletion
 */
const deleteModulById = (req, res) => {
  const moduleId = req.params.id; // Assuming the module ID is in the route parameters

  if (!moduleId) {
    res.status(400).send({
      message: 'Module ID is required!'
    });
    return;
  }

  db.deleteModulById(moduleId)
    .then(deleted => {
      if (deleted) {
        res.send({
          message: 'Module was deleted successfully.'
        });
      } else {
        res.status(404).send({
          message: `Module with ID ${moduleId} not found.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Error deleting module!'
      });
    });
};

module.exports = {
  addModul,
  deleteModulById
};
