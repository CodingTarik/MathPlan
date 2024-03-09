// Define a middleware function to check role
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.session && req.session.user && (req.session.user.role === role || req.session.user.role === 'intern')) {
      next(); // User has the required role, continue to the next middleware or route handler
    } else {
      res.redirect('noaccess'); // User does not have the required role, redirect to a page that informs the user of the lack of access
    }
  };
};

module.exports = {
  checkRole
};
