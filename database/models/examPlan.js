const { DataTypes } = require('sequelize'); // The Sequelize data types.

/**
 * Define the ExamPlan model.
 *
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @returns {import('sequelize').Model} The ExamPlan model.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {import('sequelize').Model} Model
   */

  /**
   * @type {Model}
   * @namespace ExamPlan
   * @property {integer} id - The primary key for the examination regulation.
   * @property {string} name - The name of the examination regulation.
   * @property {string} jsonSchema - The JSON string associated with the examination regulation.
   * @property {date} approvalDate - the date at which the Office for Student Affairs approved a submission
   * @property {string} typeOfPlan - "Prüfungsplan" or "Nebenfachplan"
   */
  const ExamPlan = sequelize.define('ExamPlan', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    jsonSchema: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    typeOfPlan: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  /**
   * Define associations for the ExamPlan model.
   *
   * @param {Object} models - The Sequelize models.
   */
  ExamPlan.associate = (models) => {
    /**
     * Define a N:1 relationship with the User model, representing the creator of the plan.
     *
     * @memberof ExamPlan
     * @method
     * @name belongsToCreator
     * @param {Object} models.User - The User model.
     * @param {Object} options - Additional options e.g. foreignKey-Name.
     */
    ExamPlan.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
  };

  return ExamPlan;
};
