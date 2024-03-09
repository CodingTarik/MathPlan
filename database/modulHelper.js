const logger = require('../logger.js');
const Modul = require('./database.js').models.Modul;
const Sequelize = require('sequelize');

/**
 * Adds a module to the database
 * @param {string} moduleID - The module ID
 * @param {string} moduleName - The module name
 * @param {number} moduleCredits - The number of credits for the module
 * @param {string} moduleLanguage - The language of the module
 * @param {string} moduleApplicability - The applicability of the module
 * @returns {Promise} A promise that is rejected or fulfilled depending on the success of adding the module
 */
const addModul = (
  moduleID,
  moduleName,
  moduleCredits,
  moduleLanguage,
  moduleApplicability
) => {
  const modul = {
    moduleID,
    moduleName,
    moduleCredits,
    moduleLanguage,
    moduleApplicability
  };
  logger.info(`Adding module ${moduleID} with name ${moduleName}`);
  return Modul.create(modul);
};

/**
 * Checks if a module with the given ID exists in the database
 * @param {string} moduleID - The module ID to check
 * @returns {Promise<boolean>} A promise that resolves to true if the module exists, false otherwise
 */
const isModuleExists = (moduleID) => {
  return Modul.findOne({
    where: {
      moduleID
    }
  }).then((result) => !!result);
};


/**
 * Deletes a module from the database based on its ID
 * @param {string} moduleID - The module ID to delete
 * @returns {Promise<boolean>} A promise that resolves to true if the module is deleted, false otherwise
 */
const deleteModulById = async (moduleID) => {
  try {
    logger.info(`Deleting module with ID ${moduleID}...`);
    const affectedRows = await Modul.destroy({
      where: {
        moduleID
      }
    });

    // If affectedRows is greater than 0, it means at least one record was deleted
    return affectedRows > 0;
  } catch (error) {
    logger.error('Error deleting module:', error);
    return false; // Return false if an error occurs during deletion
  }
};

/**
 * Gets all modules from the database
 * @returns {Promise<Array<ModulModel>>} A promise that resolves to an array of all modules
 */
const getAllModuls = () => {
  return Modul.findAll({ raw: true });
};

/**
 * Gets the modules that match the parameters, match meaning:
 * if a moduleID is provided: moduleID of returned modules must contain the given moduleID
 * if a moduleName is provided: moduleName of returned modules must contain the given moduleName
 * if a moduleCredits is provided: moduleCredits of returned modules must equal the given moduleCredits
 * if a moduleLanguage is provided: moduleLanguage of returned modules must equal the given moduleLanguage
 * if a moduleApplicability is provided: moduleApplicability of returned modules must equal the given moduleApplicability.
 * If more than 50 modules match only the first 50 are returned.
 * @param {string} moduleID
 * @param {string} moduleName
 * @param {string} moduleCredits
 * @param {string} moduleLanguage
 * @param {string} moduleApplicability
 * @returns {Promise<{count: number; rows: Object[];}>} A promise that is rejected or fulfilled depending on the success of getting the module(s). If
 * it is fulfilled it returns the number of matching modules and the modules themselves.
 */
const getModules = (
  moduleID,
  moduleName,
  moduleCredits,
  moduleLanguage,
  moduleApplicability
) => {
  const parameters = {};
  if (!(moduleID === 'undefined')) {
    parameters.moduleID = { [Sequelize.Op.like]: `%${moduleID}%` };
  }
  if (!(moduleName === 'undefined')) {
    parameters.moduleName = { [Sequelize.Op.like]: `%${moduleName}%` };
  }
  if (!(moduleCredits === 'undefined')) {
    parameters.moduleCredits = moduleCredits;
  }
  if (!(moduleLanguage === 'undefined')) {
    parameters.moduleLanguage = moduleLanguage;
  }
  if (!(moduleApplicability === 'undefined')) {
    parameters.moduleApplicability = moduleApplicability;
  }
  return Modul.findAndCountAll({
    where: parameters,
    limit: 50,
    order: [['moduleID', 'ASC']]
  });
};

/**
 * Finds a module with given moduleID in the database
 * @param {string} moduleID - The module ID
 * @returns {Promise<Model|null>} A promise that is rejected or fulfilled depending on the success of finding the module
 */
const getOneModule = (moduleID) => {
  return Modul.findOne({
    where: {
      moduleID
    }
  });
};

/**
 * Updates the module with the moduleId "searchModuleID" in the database
 * @param {string} searchModuleID - The module ID of the module to be modified
 * @param {string} moduleID - The new (modified) module ID
 * @param {string} moduleName - The new (modified) module name
 * @param {number} moduleCredits - The new (modified) number of credits for the module
 * @param {string} moduleLanguage - The new (modified) language of the module
 * @param {string} moduleApplicability - The new (modified) applicability of the module
 * @returns {Promise<Array<number, number>>} A promise that is rejected or fulfilled depending on the success of updating the module
 */
const updateModule = (
  searchModuleID,
  moduleID,
  moduleName,
  moduleCredits,
  moduleLanguage,
  moduleApplicability
) => {
  const modul = {
    moduleID,
    moduleName,
    moduleCredits,
    moduleLanguage,
    moduleApplicability
  };
  return Modul.update(modul, { where: { moduleID: searchModuleID } });
};
module.exports = {
  updateModule,
  getOneModule,
  addModul,
  isModuleExists,
  deleteModulById,
  getAllModuls,
  getModules
};
