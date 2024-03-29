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
const ExamPlan = require(path.join(__dirname, './models/examPlan.js'));

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
let config;
if (process.env.NODE_ENV !== 'test') {
  config /** @type {DatabaseConfig} */ = {
    database: configFile.database.DB_DATABASE,
    username: configFile.database.DB_USER, // Your MySQL username
    password: configFile.database.DB_PASSWORD, // Your MySQL password
    host: configFile.database.DB_HOST,
    logging: configFile.dev.DEBUG ? (msg) => logger.database(msg) : false,
    dialect: configFile.database.DB_DIALECT, // can be set to 'mysql' or 'sqlite'
    storage: './database.sqlite' // For SQLite, define the path to the SQLite file
  };
} else {
  // use test database instead of actual one
  config /** @type {DatabaseConfig} */ = {
    logging: configFile.dev.DEBUG ? (msg) => logger.database(msg) : false,
    dialect: 'sqlite',
    storage: 'database.test.sqlite'
  };
}

// create a sequelize object
const sequelize = new Sequelize(config);

// Initialize models
const models = {
  Modul: Modul(sequelize),
  User: User(sequelize),
  ExaminationRegulation: ExaminationRegulation(sequelize),
  ExamPlan: ExamPlan(sequelize)
};

module.exports = {
  config,
  sequelize,
  models
};
