// disable temporary const logger = require('../logger.js');
const Modul = require('./database.js').models.Modul;
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
  // todo logger.info(`Adding module ${moduleID} with name ${moduleName}`);
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
 * @returns {Promise} A promise that is rejected or fulfilled depending on the success of deleting the module
 */
/**
 * Deletes a module from the database based on its ID
 * @param {string} moduleID - The module ID to delete
 * @returns {Promise<boolean>} A promise that resolves to true if the module is deleted, false otherwise
 */
const deleteModulById = async (moduleID) => {
  try {
    // todo activate if merged logger.info(`Deleting module with ID ${moduleID}...`);
    const affectedRows = await Modul.destroy({
      where: {
        moduleID
      }
    });

    // If affectedRows is greater than 0, it means at least one record was deleted
    return affectedRows > 0;
  } catch (error) {
    // logger.error('Error deleting module:', error);
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

module.exports = {
  addModul,
  isModuleExists,
  deleteModulById,
  getAllModuls
};
