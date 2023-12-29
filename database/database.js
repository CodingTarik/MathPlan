const path = require('path');
// Config
const configFile = require(path.join(__dirname, '../config.js'));
const Sequelize = require('sequelize');

// Define database connection parameters
const config = {
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
const Modul = sequelize.define('Modul', {
  moduleID: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    autoIncrement: false
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
 * a course is added to the database by taking the content of the request body, creating a new entry and calling create of sequelize
 * @param {Sequelize.STRING} id
 * @param {Sequelize.STRING} name
 * @param {Sequelize.INTEGER} credits
 * @param {Sequelize.STRING} language
 * @param {Sequelize.STRING} applicability
 * @returns a promise that is rejected or fulfilled depending on the success of adding the module
 */
const addModul = (id, name, credits, language, applicability) => {
  const modul = {
    moduleID: id,
    moduleName: name,
    moduleCredits: credits,
    moduleLanguage: language,
    moduleApplicability: applicability
  };
  return Modul.create(modul);
};

module.exports = {
  Sequelize,
  sequelize,
  Modul,
  addModul
};
