const path = require('path');
const db = require(path.join(__dirname, '../database/database.js'));

/**
 * if a request is made the addModul function of the database is called by the controller and the added module is sent back as a response
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void} - if the passed data is not sufficient as it does not contain a module id
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
 * If a request is made, the getOneModul function of the database is called by the controller,
 * and a response with empty data in case no data entry exists with requested id
 * or with the module having the requested id is sent.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void} - Sends a response based on the success or failure of the deletion with status 500, iff an error occured while searching for a module with requested id
 */
const getOneModul = (req, res) => {
  db.getOneModul(req.params.id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Error retrieving Tutorial with id=' + req.params.id
      });
    });
};

/**
 * If a request is made, the updateModul function of the database is called by the controller,
 * and a response is sent based on the success or failure of the update.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void} - Sends a response based on the success or failure of the deletion; has status 400, iff requests holds no new data for the module and status 500, iff updating the module was not successful
 */
const updateModul = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
    return;
  }

  db.updateModul(req.params.id, req.body.id, req.body.name, req.body.credits, req.body.language, req.body.applicability)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
         err.message || 'Mistake while modifying module'
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

  if (!moduleId) { // mMn ist abfrage unnötig; wenn keine id gegeben, gibts eine 404, weil andere URL gesucht wird (eine ohne Parameter)
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

/**
 * if a request is made the getModules function of the database is called by the controller and the matching module(s)
 * is sent back as a response if there are less than 50 matching modules and no other error occurs
 * @param {Object} req
 * @param {Object} res
 */
const getModules = (req, res) => {
  db.getModules(req.params.id, req.params.name, req.params.credits, req.params.language, req.params.applicability)
    .then(data => {
      if (data.count <= 50) res.send(data.rows);
      else throw new Error('The search request yielded more than 50 requests');
    })
    .catch(err => {
      if (err.message === 'The search request yielded more than 50 requests') {
        res.status(400).send(
          'The search request yielded more than 50 requests'
        );
      } else {
        res.status(500).send({
          message:
            err.message || 'Error getting module!'
        });
      }
    });
};

module.exports = {
  addModul,
  updateModul,
  getOneModul,
  deleteModulById,
  getModules
};
