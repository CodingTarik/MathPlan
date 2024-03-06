const { DataTypes } = require('sequelize');

/**
 * Define the ExaminationRegulation model.
 *
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes - The Sequelize data types.
 * @returns {import('sequelize').Model} The ExaminationRegulation model.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {import('sequelize').Model} Model
   */

  /**
   * @type {Model}
   * @namespace ExaminationRegulation
   * @property {integer} id - The primary key for the examination regulation.
   * @property {string} name - The name of the examination regulation.
   * @property {string} jsonSchema - The JSON schema associated with the examination regulation.
   */
  const ExaminationRegulation = sequelize.define('ExaminationRegulation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    jsonSchema: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    }
  });

  /**
   * Define associations for the ExaminationRegulation model.
   *
   * @param {Object} models - The Sequelize models.
   */
  ExaminationRegulation.associate = (models) => {
    /**
     * Define a N:1 relationship with the User model, representing the creator of the regulation.
     *
     * @memberof ExaminationRegulation
     * @method
     * @name belongsToCreator
     * @param {Object} models.User - The User model.
     * @param {Object} options - Additional options e.g. foreignKey-Name.
     */
    ExaminationRegulation.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    /**
     * Define a N:M relationship with the User model, representing users who edited the regulation.
     *
     * @memberof ExaminationRegulation
     * @method
     * @name belongsToManyEditors
     * @param {Object} models.User - The User model.
     * @param {Object} options - Additional options, such as the name of the association table.
     */
    ExaminationRegulation.belongsToMany(models.User, {
      through: 'EditedByUser',
      foreignKey: 'regulationId',
      otherKey: 'editedById',
      as: 'editors'
    });
  };

  return ExaminationRegulation;
};
