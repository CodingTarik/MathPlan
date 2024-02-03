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

let Modul /** @type {ModulModel} */ = sequelize.define('Modul', {
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
    allowNull: true
  },
  moduleCredits: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  moduleLanguage: {
    type: Sequelize.STRING,
    allowNull: true
  },
  moduleApplicability: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

/**
 * Modul setter
 * @param {Object} newModul
 */
const setModul = (newModul) => {
  Modul = newModul;
};

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
 * @returns {boolean} True if the module is deleted, false otherwise
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
const getModules = (moduleID, moduleName, moduleCredits, moduleLanguage, moduleApplicability) => {
  const parameters = {};
  if (!(moduleID === 'undefined')) parameters.moduleID = { [Sequelize.Op.like]: `%${moduleID}%` };
  if (!(moduleName === 'undefined')) parameters.moduleName = { [Sequelize.Op.like]: `%${moduleName}%` };
  if (!(moduleCredits === 'undefined')) parameters.moduleCredits = moduleCredits;
  if (!(moduleLanguage === 'undefined')) parameters.moduleLanguage = moduleLanguage;
  if (!(moduleApplicability === 'undefined')) parameters.moduleApplicability = moduleApplicability;
  console.log(parameters);
  return Modul.findAndCountAll({
    where: parameters,
    limit: 50,
    order: [['moduleID', 'ASC']]
  });
};

const getIncompleteModules = () => {
  console.log("testing getting incomplete modules...")
  //TODO comments
  const parameters = {/*
    $or: [
      {
        moduleName: null
      }, 
      {
        moduleCredits: null
      }, 
      {
        moduleLanguage: null
      }, 
      {
        moduleApplicability: null
      }, 
    ]*/
  };
  return Modul.findAll({
    where: //parameters,
    {
      moduleName: null,
      //moduleCredits: null,
      //moduleLanguage: null,
      //moduleApplicability: null
    }
    //order: [['moduleID', 'ASC']]
  })
}

module.exports = {
  config,
  Sequelize,
  sequelize,
  Modul,
  setModul,
  addModul,
  isModuleExists,
  deleteModulById,
  getAllModules,
  getModules,
  getIncompleteModules
};
