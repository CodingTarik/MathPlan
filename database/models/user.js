const { DataTypes } = require('sequelize');
// Dummy file has to be eduted with SSO and session management
module.exports = (sequelize) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true // Validate that the email is in the correct format
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
