const session = require('express-session');
const { Issuer, Strategy, custom } = require('openid-client');
const logger = require('../logger');

const setupSessionAndOpenID = async (app) => {
  await registerSession(app);
  await setupOpenID(app);
  logger.info('Session and OpenID setup complete');
};

// Register session
const registerSession = async (app) => {
  const sessionConfig = {
    secret: 'secret key', // TODO random generate key secure
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  };
  app.use(session(sessionConfig));
};

// Register OpenID
const setupOpenID = async (app) => {
  // set timeout little higher default is very low
  custom.setHttpOptionsDefaults({
    timeout: 15000
  });
  // TODO try catch if issuer is not reachable or timeout (use logger.error)
  const identidyProviderIssuer = await Issuer.discover(
    'https://accounts.google.com' // TODO make this configurable
  );
  const client = new identidyProviderIssuer.Client({
    client_id:
      'id from hrz', // TODO important do not hardcode and commit! use environment variables
    client_secret: 'secret from hrz', // TODO important do not hardcode and commit! use environment variables
    redirect_uris: ['http://localhost:80/callback'] // TODO change based on domain in config, add https and only http if activated
  });

  const params = {
    scope: 'openid email profile' // specify attributes to be returned (scope)
  };

  const googleAuthUrl = client.authorizationUrl(params);

  app.get('/login', (req, res) => {
    res.redirect(googleAuthUrl);
  });

  app.get('/callback', async (req, res) => {
    // TODO try catch if issuer is not reachable or timeout (use logger.error)
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
      'http://localhost:80/callback', // TODO change based on domain in config, add https and only http if activated
      params
    );

    req.session.tokenSet = tokenSet;
    res.redirect('/');
  });

  app.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });

  app.get('/testlogin', async (req, res) => {
    if (req.session.tokenSet) {
      const userinfo = await client.userinfo(req.session.tokenSet.access_token);
      res.send(`Welcome, ${userinfo.name} (${userinfo.email})`);
    } else {
      res.send('You are not logged in. <a href="/login">Login</a>');
    }
  });
};

module.exports = { setupSessionAndOpenID };
