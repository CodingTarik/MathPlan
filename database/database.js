const path = require('path');
// Config
const configFile = require(path.join(__dirname, '../config.js'));
const Sequelize = require('sequelize');

// Choose the database dialect (mysql or sqlite)
const dialect = 'mysql'; // Change this to 'mysql' if you want to use MySQL

// Define database connection parameters
const config = {
  database: configFile.database.DB_DATABASE,
  username: configFile.database.DB_USER, // Your MySQL username
  password: configFile.database.DB_PASSWORD, // Your MySQL password
  host: configFile.database.DB_HOST,
  dialect,
  storage: './database.sqlite' // For SQLite, define the path to the SQLite file
};

// create a sequelize object
const sequelize = new Sequelize(config);

// the table with the courses and its attributes is defined
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

// a course is added to the database by taking the content of the request body, creating a new entry and calling create of sequelize
const addModul = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
    return;
  }
  const modul = {
    moduleID: req.body.id,
    moduleName: req.body.name,
    moduleCredits: req.body.credits,
    moduleLanguage: req.body.language,
    moduleApplicability: req.body.applicability

  };
  Modul.create(modul)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Fehler beim Hinzufügen des Moduls'
      });
    });
};

module.exports = {
  Sequelize,
  sequelize,
  Modul,
  addModul
};
