/* eslint security/detect-object-injection: 0 */
// disabled because of too many false positives, has to be analyzed in the security test
const path = require('path');
const logger = require('../logger');
const modulHelper = require(path.join(__dirname, '../database/modulHelper.js'));
const examRegulationHelper = require(
  path.join(__dirname, '../database/examRegulationHelper.js')
);
/**
 * if a request is made the addModul function of the database is called by the controller and the added module is sent back as a response
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void} - Sends a response with if the passed data is not sufficient as it does not contain a module id
 */
const addModul = async (req, res) => {
  if (!req.body.id) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
    return;
  }
  modulHelper
    .addModul(
      req.body.id,
      req.body.name,
      req.body.credits,
      req.body.language,
      req.body.applicability
    )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send({
        message: err.message || 'Error adding module!'
      });
    });
};

/**
 * If a request is made, the getOneModul function of the database is called by the controller,
 * and a response with empty data in case no data entry exists with requested id
 * or with the module having the requested id is sent.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void} - Sends a response based on the success or failure of the search with status 200 in case of success and with status 500, iff an error occured while searching for a module with requested id
 */
const getOneModule = (req, res) => {
  modulHelper
    .getOneModule(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      // for the upload modules to the database functionality
      res.status(500).send({
        message:
          err.message || 'Error retrieving Tutorial with id=' + req.params.id
      });
    });
};

/**
 * If a request is made, the updateModul function of the database is called by the controller,
 * and a response is sent based on the success or failure of the update.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void} - Sends a response based on the success or failure of the modification; has status 200 in case of success, has status 400, iff requests holds no new data for the module and status 500, iff updating the module was not successful
 */
const updateModule = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
    return;
  }

  modulHelper
    .updateModule(
      req.params.id,
      req.body.id,
      req.body.name,
      req.body.credits,
      req.body.language,
      req.body.applicability
    )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Mistake while modifying module'
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
const deleteModulById = async (req, res) => {
  const moduleId = req.params.id; // Assuming the module ID is in the route parameters

  modulHelper
    .deleteModulById(moduleId)
    .then((deleted) => {
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
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error deleting module!'
      });
    });
};

/**
 * Handles the retrieval of all modules.
 * Converts the JSON-editor syntax with [] to a large object so every module in data array needs to be concated to json object but as an object element
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response with all modules or an error message.
 */
const getAllModulsForJSONEditor = (req, res) => {
  modulHelper
    .getAllModuls()
    .then((data) => {
      // for json-editor we need to convert the
      // json-editor syntax with [] to a large object
      // so every module in data array needs to be concated to json object but as an object element
      // like so {"0":{...},"1":{...}}
      const json = {};
      data.forEach((item, index) => {
        json[index] = item;
      });
      data = json;
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error retrieving modules!'
      });
    });
};

/**
 * Handles the retrieval of all modules with minimal information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response with minimal information for each module or an error message.
 */
const getAllModulsMin = async (req, res) => {
  modulHelper
    .getAllModuls()
    .then((data) => {
      // for json-editor we need to convert the
      // json-editor syntax with [] to a large object
      // so every module in data array needs to be concated to json object but as an object element
      // like so {"0":{...},"1":{...}}
      // code duplicated here! @see getAllModuls, but code is to small to extract it to a function
      const json = {};
      data.forEach((item, index) => {
        json[index] = item;
      });
      // for the min version we only need moduleID, moduleName, moduleCredits, moduleLanguage, moduleApplicability
      // so we delete all other keys, create a new object and send it back
      // iterate through all modules
      for (const modulekey in json) {
        // iterate through all keys of module
        for (const key in json[modulekey]) {
          // delete all keys that are not needed
          if (
            key !== 'moduleID' &&
            key !== 'moduleName' &&
            key !== 'moduleCredits' &&
            key !== 'moduleLanguage' &&
            key !== 'moduleApplicability'
          ) {
            delete json[modulekey][key];
          }
        }
      }

      data = json;
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error retrieving modules!'
      });
    });
};

/**
 * Express controller function to handle the JSON schema of an exam regulation.
 * This function assumes that the JSON schema is sent in the request body.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response based on the success or failure of processing the JSON schema.
 */
const addOrUpdateExamRegulation = async (req, res) => {
  try {
    // Access the JSON schema from the request body
    const examRegulationSchemaRequest = req.body;
    // check if contains fields examRegulation and internalName
    if (
      !examRegulationSchemaRequest.examRegulation ||
      !examRegulationSchemaRequest.internalName
    ) {
      res.status(400).send({
        message:
          'Content can not be empty! Empty field: ' +
          (!examRegulationSchemaRequest.examRegulation
            ? 'examRegulation'
            : 'internalName')
      });
      return;
    }
    const examRegulationSchema = examRegulationSchemaRequest.examRegulation;
    const internalName = examRegulationSchemaRequest.internalName;

    // Add schema to database
    await examRegulationHelper.addOrUpdateExamRegulation(
      examRegulationSchema,
      internalName
    );

    // Send a success response
    res.status(200).json({
      success: true,
      message: 'Exam regulation schema processed successfully.'
    });
  } catch (error) {
    // Handle any errors that occurred during processing
    logger.error('Error processing exam regulation schema: ' + error.message);

    // Send an error response
    res.status(500).json({
      success: false,
      message: 'Error processing exam regulation schema.',
      error: error.message
    });
  }
};
/**
 * if a request is made the getModules function of the database is called by the controller and the matching module(s)
 * is sent back as a response if there are less than 50 matching modules and no other error occurs
 * @param {Object} req
 * @param {Object} res
 */
const getModules = (req, res) => {
  modulHelper
    .getModules(
      req.params.id,
      req.params.name,
      req.params.credits,
      req.params.language,
      req.params.applicability
    )
    .then((data) => {
      if (data.count <= 50) res.send(data.rows);
      else throw new Error('The search request yielded more than 50 requests');
    })
    .catch((err) => {
      if (err.message === 'The search request yielded more than 50 requests') {
        res
          .status(400)
          .send('The search request yielded more than 50 requests');
      } else {
        res.status(500).send({
          message: err.message || 'Error getting module!'
        });
      }
    });
};

module.exports = {
  addModul,
  deleteModulById,
  getAllModulsForJSONEditor,
  getAllModulsMin,
  addOrUpdateExamRegulation,
  updateModule,
  getOneModule,
  getModules
};
