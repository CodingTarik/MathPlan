// Define a middleware function to check role
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.session && req.session.user && (req.session.user.role === role || res.session.user.role === 'intern')) {
      next(); // User has the required role, continue to the next middleware or route handler
    } else {
      res.status(403).send('Forbidden'); // User does not have the required role, send 403 Forbidden response
    }
  };
};

module.exports = {
  checkRole
};
