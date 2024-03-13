const session = require('express-session');
const { Issuer, custom } = require('openid-client');
const logger = require('../logger');
const crypto = require('crypto');
const config = require('../config');
const user = require('../database/userHelper');
const renderError = require('../routes/error').renderError;

/**
 * client for the openid provider.
 * This is null before it is initialized in setupOpenID().
 */
let client = null;

/**
 * Configuration object for Single Sign-On (SSO).
 * @property {string} client_id - The client ID for SSO.
 * @property {string} client_secret - The client secret for SSO.
 * @property {string[]} redirect_uris - The redirect URIs for SSO. This is the callback URL.
 * @property {string[]} response_types - The response types for SSO. 'code' is default response type.
 */
const ssoconfig = {
  client_id: config.auth.SSO_CLIENT_ID,
  client_secret: config.auth.SSO_CLIENT_SECRET,
  redirect_uris: [config.auth.SSO_REDIRECT_URI],
  response_types: ['code']
};

const params = { // parameters for the authorization request
  scope: 'openid tudMatrikel sub cn memberOf ' // attributes to be returned (scope)
};

/**
 * Function to generate a random secret key
 * @returns {string} - A random generated key
 */
function generateSecretKey() {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Sets up the session and OpenID for the app.
 *
 * @param {Object} app - The app object.
 * @returns {Promise} A promise that resolves when the session and OpenID setup is complete.
 */
const setupSessionAndOpenID = (app) => {
  registerSession(app);
  if (config.dev.DEBUG) logger.info('Session setup complete');
  setupOpenID(app);
  if (config.dev.DEBUG) logger.info('Session and OpenID setup complete');
};

/**
 * Registers session middleware for handling user sessions.
 * And sets up middleware to check if user is logged in and set the locals.
 *
 * @param {Object} app - The Express app object.
 */
const registerSession = (app) => {
  const sessionConfig = {
    secret: generateSecretKey(), // random generated key
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: 'strict'
    }
  };
  // register session
  app.use(session(sessionConfig));

  // middleware to check if user is logged in and set the locals
  app.use((req, res, next) => {
    const session = req.session;
    // check if session is set
    if (session && session.user) {
      res.locals.isloggedin = true;
      res.locals.isIntern = session.user ? session.user.role === 'intern' : false;
      res.locals.isTeach = session.user ? session.user.role === 'teacher' : false;
      res.locals.name = session.user.name;
      res.locals.email = session.user.email;
    } else {
      res.locals.isloggedin = false;
      res.locals.isIntern = false;
      res.locals.isTeach = false;
    }
    next();
  });
};

/**
 * Sets up OpenID authentication for the application.
 * @param {Object} app - The Express app object.
 */
const setupOpenID = (app) => {
  // set timeout a little higher as the default value is very low
  custom.setHttpOptionsDefaults({
    timeout: 15000
  });

  // reach out to the openid provider to get the client
  Issuer.discover(config.auth.SSO_ISSUER)
    .then((issuer) => {
      client = new issuer.Client(ssoconfig);
    })
    .catch((err) => {
      logger.error('Issuer not available. Caught ' + err);
    });

  // handles the login route and redirects to the openid provider
  app.get('/login', (req, res) => {
    try {
      res.redirect(client.authorizationUrl(params));
    } catch (err) {
      logger.error(err);
      res.redirect('/loginnotworking');
      renderError(req, res, err);
    }
  });
  // handles the callback route and validates the user
  app.get('/callback', async (req, res) => {
    try {
      const params = client.callbackParams(req);
      const tokenSet = await client.callback(config.auth.SSO_REDIRECT_URI, params);
      const userinfo = await client.userinfo(tokenSet.access_token);
      await validateUser(req, res, userinfo);
      logger.info('User logged in: ' + userinfo.email);
      res.redirect('/');
    } catch (err) {
      logger.error(err);
      renderError(req, res, err);
    }
  });
  // handles the logout route and destroys the session
  app.get('/logout', (req, res) => {
    try {
      req.session.destroy(() => {
        logger.info('User logged out: ' + res.locals.email);
        res.redirect('/');
      });
    } catch (err) {
      logger.error(err);
      renderError(req, res, err);
    }
  });
};

/**
 * Determines the role of a user based on their userinfo.
 * @param {Object} userinfo - The userinfo object containing user information.
 * @returns {string} The role of the user ('intern', 'teacher', or 'student').
 */
function getUserRole(userinfo) {
  if (userinfo.memberOf.includes('100063sbmathpl_studbuero') || userinfo.memberOf.includes('100063sbmathpl_studproj')) {
    return 'intern';
    // eslint-disable-next-line
  } else if (false) { // TODO: add logic for a teacher group when available
    return 'teacher';
  } else {
    return 'student';
  }
}
/**
 * Validates the user and performs necessary actions based on the user's information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} userinfo - The user's information.
 * @returns {Promise<void>} - A promise that resolves once the validation is complete.
 */
const validateUser = async (req, res, userinfo) => {
  const role = getUserRole(userinfo); // determine the accessability of the user to the different parts/routes of the app
  // check if user exits in database
  if (await user.isUserExists(userinfo.email)) {
    req.session.isLoggedin = true;
    // get user from database
    req.session.user = await user.getUserByEmail(userinfo.email);
    // check if the role has changed and updates the role in the database
    if (req.session.user.role !== role) {
      req.session.user.role = role;
      await user.setRoleByEmail(req.session.user.email, role);
    }
  } else {
    // create new user
    req.session.user = await user.addUser(
      userinfo.given_name + ' ' + userinfo.family_name,
      userinfo.email,
      role,
      userinfo.tudMatrikel
    );
    logger.info('User created: ' + req.session.user.email);
  }
};
module.exports = { setupSessionAndOpenID };
