const config = require('../config');
/**
 * Middleware function to check if the user has the required role.
 *
 * @param {string} role - The required role for accessing a route or resource.
 * @returns {Function} - Middleware function that checks if the user has the required role.
 */
const checkRole = (role) => {
  return (req, res, next) => {
    // Check if the user is logged in and has the required role or is in development mode or test mode
    if ((req.session && req.session.user && (req.session.user.role === role || req.session.user.role === 'intern')) || process.env.NODE_ENV === 'test' || config.dev.DEVELOPMENT_MODE === 'true') {
      next(); // User has the required role, continue to the next middleware or route handler
    } else {
      res.redirect('noaccess'); // User does not have the required role, redirect to a page that informs the user of the lack of access
    }
  };
};

module.exports = {
  checkRole
};
