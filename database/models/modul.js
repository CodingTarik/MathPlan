const { DataTypes } = require('sequelize');

/**
 * Define the modul model.
 *
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes - The Sequelize data types.
 * @returns {import('sequelize').Model} the modul model.
 */
module.exports = (sequelize) => {
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    moduleID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    moduleName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    moduleCredits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    moduleLanguage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    moduleApplicability: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return Modul;
};
