const logger = require('../logger.js');
const user = require('./database.js').models.User;

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

const isUserExists = (email) => {
  return user
    .findOne({
      where: {
        email
      }
    })
    .then((result) => !!result);
};

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
