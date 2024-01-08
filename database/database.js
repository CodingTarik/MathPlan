const path = require('path');

// Config
const configFile = require(path.join(__dirname, '../config.js'));
const Sequelize = require('sequelize');

// Models
const Modul = require(path.join(__dirname, './models/modul.js'));
const User = require(path.join(__dirname, './models/user.js'));
const ExaminationRegulation = require(path.join(__dirname, './models/examinationregulation.js'));

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

// Initialize models
const models = {
  Modul: Modul(sequelize),
  User: User(sequelize),
  ExaminationRegulation: ExaminationRegulation(sequelize)
};

module.exports = {
  config,
  sequelize,
  models
};
