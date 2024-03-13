const logger = require('../logger.js');
const user = require('./database.js').models.User;

/**
 * Adds a new user to the database.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} role - The role of the user.
 * @param {string} matrikelnr - The matrikelnr of the user.
 * @returns {Promise} A promise that resolves with the newly created user object, or null if an error occurs.
 */
const addUser = (name, email, role, matrikelnr) => {
  try {
    const newUser = {
      name,
      email,
      role,
      matrikelnr
    };
    logger.info(`Adding user ${name} with email ${email}`);
    return user.create(newUser);
  } catch (err) {
    logger.error(err);
    return null;
  }
};

/**
 * Checks if a user with the given email exists in the database.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the user exists or not.
 */
const isUserExists = async (email) => {
  return user
    .findOne({
      where: {
        email
      }
    })
    .then((result) => !!result);
};

/**
 * Deletes a user from the database by email.
 * @param {string} email - The email of the user to be deleted.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user was deleted successfully, or false otherwise.
 */
const deleteUserByEmail = async (email) => {
  try {
    logger.info(`Deleting user with email ${email}...`);
    const affectedRows = await user.destroy({
      where: {
        email
      }
    });
    return affectedRows > 0;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

/**
 * Retrieves the role of a user based on their email.
 * @param {string} email - The email of the user.
 * @returns {Promise<string|null>} The role of the user, or null if the user is not found.
 */
const getRoleByEmail = async (email) => {
  try {
    const result = await user.findOne({
      where: {
        email
      }
    });
    return result ? result.role : null;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

/**
 * Sets the role of a user by their email.
 *
 * @param {string} email - The email of the user.
 * @param {string} role - The new role to be set.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the role was successfully set.
 */
const setRoleByEmail = async (email, role) => {
  try {
    const result = await user.update(
      {
        role
      },
      {
        where: {
          email
        }
      }
    );
    return result[0] > 0;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

/**
 * Retrieves a user from the database based on the provided email.
 *
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the user object if found, or null if not found.
 */
const getUserByEmail = async (email) => {
  try {
    const result = await user.findOne({
      where: {
        email
      }
    });
    return result || null;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

module.exports = {
  addUser,
  isUserExists,
  deleteUserByEmail,
  getRoleByEmail,
  setRoleByEmail,
  getUserByEmail
};
