/* const mysql = require('mysql2')
const path = require("path")
// Config
const config = require(path.join(__dirname, '../config.js'))



// collection of connections to the database
const pool = mysql.createPool({
    host: config.database.DB_HOST,
    user: config.database.DB_USER,
    password: config.database.DB_PASSWORD,
    database: config.database.DB_DATABASE
}).promise()

async function showAll() {
    const result = await pool.query("SELECT * FROM module")
}

result = await showAll()
console.log(result[0])


    /* const result = await pool.query("SELECT * FROM module", function(err, results, fields) {
        console.log(results);
    }
    ) */


const path = require("path")
// Config
const config_file = require(path.join(__dirname, '../config.js'))
// dbController.js
const Sequelize = require('sequelize');

// Choose the database dialect (mysql or sqlite)
const dialect = 'mysql'; // Change this to 'mysql' if you want to use MySQL

// Define database connection parameters
const config = {
  database: config_file.database.DB_DATABASE,
  username: config_file.database.DB_USER, // Your MySQL username
  password: config_file.database.DB_PASSWORD, // Your MySQL password
  host: config_file.database.DB_HOST,
  dialect: dialect,
  storage: 'path/to/database.sqlite', // For SQLite, define the path to the SQLite file
};

// Sequelize-Instanz erstellen
const sequelize = new Sequelize(config);

// Benutzer-Modell definieren
const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  // Weitere Benutzerattribute hier hinzufügen
});

// Modul-Modell definieren
const Modul = sequelize.define('Modul', {
  moduleID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  moduleName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  moduleCredits: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  moduleLanguage: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  moduleAppliciability: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Beziehungen zwischen Benutzer und Modul hinzufügen, falls erforderlich

// Tabellen erstellen (nur einmal ausführen)
/* const initialize = async () => {
    try {
    await sequelize.sync();
    } catch (error) {
    console.error('Fehler beim Synchronisieren der Datenbank: ', error);
    }
} */

// Funktionen für Benutzer-Operationen
const addUser = async (username) => {
  try {
    const user = await User.create({ username });
    return user;
  } catch (error) {
    throw new Error(`Fehler beim Hinzufügen des Benutzers: ${error.message}`);
  }
};

const deleteUser = async (userId) => {
  try {
    const deletedUser = await User.destroy({ where: { id: userId } });
    return deletedUser;
  } catch (error) {
    throw new Error(`Fehler beim Löschen des Benutzers: ${error.message}`);
  }
};

const editUser = async (userId, newData) => {
  try {
    const editedUser = await User.update(newData, { where: { id: userId } });
    return editedUser;
  } catch (error) {
    throw new Error(`Fehler beim Bearbeiten des Benutzers: ${error.message}`);
  }
};

const getUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error(`Fehler beim Abrufen der Benutzer: ${error.message}`);
  }
};

// Funktionen für Modul-Operationen
const addModul = (moduleData) => {
    if (!req.body.title) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }
    const modul = {
        moduleID: req.body.id,
        moduleName: req.body.name,
        moduleCredits: req.body.credits,
        moduleLanguage: req.body.language,
        moduleAppliciability: req.body.appliciability

    };
    Modul.create(modul)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Fehler beim Hinzufügen des Moduls"
      });
    });
};

const deleteModul = async (moduleId) => {
  try {
    const deletedModul = await Modul.destroy({ where: { moduleID: moduleId } });
    return deletedModul;
  } catch (error) {
    throw new Error(`Fehler beim Löschen des Moduls: ${error.message}`);
  }
};

const editModul = async (moduleId, newData) => {
  try {
    const editedModul = await Modul.update(newData, { where: { moduleID: moduleId } });
    return editedModul;
  } catch (error) {
    throw new Error(`Fehler beim Bearbeiten des Moduls: ${error.message}`);
  }
};

const getModuls = async () => {
  try {
    const moduls = await Modul.findAll();
    return moduls;
  } catch (error) {
    throw new Error(`Fehler beim Abrufen der Module: ${error.message}`);
  }
};

//initialize()
//addModul({moduleID: 1,moduleName: 'Analysis', moduleCredits: 3, moduleLanguage: 'Deutsch', moduleAppliciability: 'M.Sc. Mathematik'});
//const result = getModuls()
//console.log(result)

module.exports = {
  Sequelize,
  sequelize,
  User,
  Modul,
  addUser,
  deleteUser,
  editUser,
  getUsers,
  addModul,
  deleteModul,
  editModul,
  getModuls,
};

