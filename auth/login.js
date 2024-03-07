const session = require('express-session');
const { Issuer, custom } = require('openid-client');
const logger = require('../logger');
const crypto = require('crypto');
const config = require('../config');
const renderError = require('../routes/error').renderError;
let client = null;

const ssoconfig = {
  client_id: config.auth.openid_client_id,
  client_secret: config.auth.openid_client_secret,
  redirect_uris: [config.auth.REDIRECT_URI],
  response_types: ['code']
};

const params = {
  scope: 'openid email profile' // specify attributes to be returned (scope)
};

function generateSecretKey() {
  return crypto.randomBytes(64).toString('hex');
}

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
};

// Register OpenID
const setupOpenID = (app) => {
  // set timeout little higher default is very low
  custom.setHttpOptionsDefaults({
    timeout: 15000
  });

  // TODO TRY CATCH IF ISSUER IS NOT REACHABLE OR TIMEOUT (USE LOGGER.ERROR)
  Issuer.discover(config.auth.openid_discovery_url)
    .then((issuer) => {
      client = new issuer.Client(ssoconfig);
    })
    .catch((err) => {
      logger.error(err);
    });

  app.get('/login', (req, res) => {
    try {
      res.redirect(client.authorizationUrl(params));
    } catch (err) {
      logger.error(err);
      renderError(req, res, err);
    }
  });

  app.get('/callback', async (req, res) => {
    try {
      const params = client.callbackParams(req);
      const tokenSet = await client.callback(config.auth.REDIRECT_URI, params);
      const userinfo = await client.userinfo(tokenSet.access_token);
      req.session.userinfo = userinfo;
      logger.info('User logged in info: ' + JSON.stringify(userinfo));
    } catch (err) {
      logger.error(err);
      renderError(req, res, err);
    }
  });

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

  app.get('/testlogin', async (req, res) => {
    try {
      if (req.session.tokenSet) {
        const userinfo = await client.userinfo(
          req.session.tokenSet.access_token
        );
        console.log(userinfo);
        res.send(`Welcome, ${userinfo.name} (${userinfo.email}) `);
      } else {
        res.send('You are not logged in. <a href="/login">Login</a>');
      }
    } catch (err) {
      logger.error(err);
      renderError(req, res, err);
    }
  });
};

module.exports = { setupSessionAndOpenID };
