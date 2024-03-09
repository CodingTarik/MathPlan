const session = require('express-session');
const { Issuer, custom } = require('openid-client');
const logger = require('../logger');
const crypto = require('crypto');
const config = require('../config');
const user = require('../database/userHelper');
const renderError = require('../routes/error').renderError;

let client = null;

// OpenID configuration
const ssoconfig = {
  client_id: config.auth.openid_client_id,
  client_secret: config.auth.openid_client_secret,
  redirect_uris: [config.auth.REDIRECT_URI],
  response_types: ['code']
};

const params = { // those are the parameters that work with the google login
  scope: 'openid email profile' // specify attributes to be returned (scope)
};

/**
 * Function to generate a random secret key
 * @returns {string} - A random generated key
 */
function generateSecretKey() {
  return crypto.randomBytes(64).toString('hex');
}

// Setup session and OpenID
const setupSessionAndOpenID = (app) => {
  registerSession(app);
  logger.info('Session setup complete');
  setupOpenID(app);
  logger.info('Session and OpenID setup complete');
};

// Register session
const registerSession = (app) => {
  const sessionConfig = {
    secret: generateSecretKey(), // random generated key
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  };

  app.use(session(sessionConfig));

  // Register session middleware handling
  app.use((req, res, next) => {
    const session = req.session;
    // check if session is set
    if (session && session.user) {
      res.locals.isloggedin = !!session.user;
      res.locals.isIntern = session.user
        ? session.user.role === 'intern'
        : false;
      logger.info(session.user.role);
      res.locals.isTeach = session.user
        ? session.user.role === 'teacher'
        : false;
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

// Register OpenID
const setupOpenID = (app) => {
  // set timeout little higher default is very low
  custom.setHttpOptionsDefaults({
    timeout: 15000
  });

  Issuer.discover(config.auth.openid_discovery_url)
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
      const tokenSet = await client.callback(config.auth.REDIRECT_URI, params);
      const userinfo = await client.userinfo(tokenSet.access_token);
      await validateUser(req, res, userinfo);
      req.session.userinfo = userinfo;
      logger.info('User logged in: ' + req.session.user.email);
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
        res.redirect('/');
      });
    } catch (err) {
      logger.error(err);
      renderError(req, res, err);
    }
  });
  // test route to check if user is logged in
  app.get('/testlogin', async (req, res) => {
    try {
      if (req.session.user) {
        res.send('Welcome, ' + req.session.user.name + ' (' + req.session.user.email + ')');
      } else {
        res.send('You are not logged in. <a href="/login">Login</a>');
      }
    } catch (err) {
      logger.error(err);
      renderError(req, res, err);
    }
  });
};

/**
 * Validates the user and performs necessary actions based on the user's information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} userinfo - The user's information.
 * @returns {Promise<void>} - A promise that resolves once the validation is complete.
 */
const validateUser = async (req, res, userinfo) => {
  const isAdmin = userinfo.email === config.auth.admin;
  // check if user exits in database
  if (await user.isUserExists(userinfo.email)) {
    // user exits
    req.session.isLoggedin = true;
    req.session.user = await user.getUserByEmail(userinfo.email);
    // check if user is admin
    if (!(req.session.user.role === 'admin') && isAdmin) {
      // update user role to admin
      await user.setRoleByEmail(userinfo.email, 'intern');
      req.session.user = await user.getUserByEmail(userinfo.email);
    }
  } else {
    // create new user
    // TODO change logic for isAdmin and matrikelnumber (0)
    req.session.user = await user.addUser(
      userinfo.name,
      userinfo.email,
      isAdmin ? 'intern' : 'student',
      userinfo.email // matrikelnumber to be added, when available
    );
    logger.info('User created: ' + req.session.user.email);
  }
};
module.exports = { setupSessionAndOpenID };
