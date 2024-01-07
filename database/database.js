const path = require('path');
// Config
const configFile = require(path.join(__dirname, '../config.js'));
const Sequelize = require('sequelize');

/**
 * Database connection configuration
 * @typedef {Object} DatabaseConfig
 * @property {string} database - The database name
 * @property {string} username - The database username
 * @property {string} password - The database password
 * @property {string} host - The database host
 * @property {string} dialect - The database dialect ('mysql' or 'sqlite')
 * @property {string} storage - The path to the SQLite file (only for SQLite)
 */

// Define database connection parameters
const config /** @type {DatabaseConfig} */ = {
  database: configFile.database.DB_DATABASE,
  username: configFile.database.DB_USER, // Your MySQL username
  password: configFile.database.DB_PASSWORD, // Your MySQL password
  host: configFile.database.DB_HOST,
  dialect: configFile.database.DB_DIALECT, // can be set to 'mysql' or 'sqlite'
  storage: './database.sqlite' // For SQLite, define the path to the SQLite file
};

// create a sequelize object
const sequelize = new Sequelize(config);

// the table with the courses and its attributes is defined
// here and below as well we write 'modul' instead of 'module' to clarify that we mean university modules not NodeJS modules
/**
 * Sequelize model for university modules
 * @typedef {Object} ModulModel
 * @property {number} id - Artificial primary key for the module
 * @property {string} moduleID - The module ID
 * @property {string} moduleName - The module name
 * @property {number} moduleCredits - The number of credits for the module
 * @property {string} moduleLanguage - The language of the module
 * @property {string} moduleApplicability - The applicability of the module
 */

const Modul /** @type {ModulModel} */ = sequelize.define('Modul', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  moduleID: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  moduleName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  moduleCredits: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  moduleLanguage: {
    type: Sequelize.STRING,
    allowNull: false
  },
  moduleApplicability: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

/**
 * Adds a module to the database
 * @param {string} moduleID - The module ID
 * @param {string} moduleName - The module name
 * @param {number} moduleCredits - The number of credits for the module
 * @param {string} moduleLanguage - The language of the module
 * @param {string} moduleApplicability - The applicability of the module
 * @returns {Promise} A promise that is rejected or fulfilled depending on the success of adding the module
 */
const addModul = (moduleID, moduleName, moduleCredits, moduleLanguage, moduleApplicability) => {
  const modul = {
    moduleID,
    moduleName,
    moduleCredits,
    moduleLanguage,
    moduleApplicability
  };
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
    const affectedRows = await Modul.destroy({
      where: {
        moduleID
      }
    });

    // If affectedRows is greater than 0, it means at least one record was deleted
    return affectedRows > 0;
  } catch (error) {
    console.error('Error deleting module:', error);
    return false; // Return false if an error occurs during deletion
  }
};

/**
 * Gets all modules from the database
 * @returns {Promise<Array<ModulModel>>} A promise that resolves to an array of all modules
 */
const getAllModules = () => {
  return Modul.findAll();
};

module.exports = {
  config,
  Sequelize,
  sequelize,
  Modul,
  addModul,
  isModuleExists,
  deleteModulById,
  getAllModules
};
