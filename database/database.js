const path = require('path');
const logger = require(path.join(__dirname, '../logger'));

// Config
const configFile = require(path.join(__dirname, '../config.js'));
const Sequelize = require('sequelize');

// Models
const Modul = require(path.join(__dirname, './models/modul.js'));
const User = require(path.join(__dirname, './models/user.js'));
const ExaminationRegulation = require(
  path.join(__dirname, './models/examinationregulation.js')
);

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
// eslint-disable-next-line prefer-const
let config /** @type {DatabaseConfig} */ = {
  database: configFile.database.DB_DATABASE,
  username: configFile.database.DB_USER, // Your MySQL username
  password: configFile.database.DB_PASSWORD, // Your MySQL password
  host: configFile.database.DB_HOST,
  logging: configFile.dev.DEBUG ? (msg) => logger.database(msg) : false,
  dialect: configFile.database.DB_DIALECT, // can be set to 'mysql' or 'sqlite'
  storage: './database.sqlite' // For SQLite, define the path to the SQLite file
};

// create a sequelize object
// variable because override should be possible e.g. for testing, overriding sequelize with a mock or custom config
// eslint-disable-next-line prefer-const
let sequelize = new Sequelize(config);

// Initialize models
const modelFunction = (sequelize) => {
  return {
    Modul: Modul(sequelize),
    User: User(sequelize),
    ExaminationRegulation: ExaminationRegulation(sequelize)
  };
};
// Initialize models
// used for changing the models in test with second sequelize
// eslint-disable-next-line prefer-const
let models = modelFunction(sequelize);

module.exports = {
  config,
  sequelize,
  modelFunction,
  models
};
