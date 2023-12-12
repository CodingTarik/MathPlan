const path = require('path');
// Config
const configFile = require(path.join(__dirname, '../config.js'));
// dbController.js
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
  storage: 'path/to/database.sqlite' // For SQLite, define the path to the SQLite file
};

// Sequelize-Instanz erstellen
const sequelize = new Sequelize(config);

/*
// Benutzer-Modell definieren
const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
  // Weitere Benutzerattribute hier hinzufügen
});
*/

// Modul-Modell definieren
const Modul = sequelize.define('Modul', {
  moduleID: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    autoIncrement: false // TODO okay so?
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

// Beziehungen zwischen Benutzer und Modul hinzufügen, falls erforderlich

// Funktionen für Benutzer-Operationen
/*
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
*/
// Funktionen für Modul-Operationen
const addModul = (req, res) => {
  console.log(req);
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
/*
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
*/

module.exports = {
  Sequelize,
  sequelize,
  //  User,
  Modul,
  /*  addUser,
  deleteUser,
  editUser,
  getUsers, */
  addModul/*,
  deleteModul,
  editModul,
  getModuls */
};
