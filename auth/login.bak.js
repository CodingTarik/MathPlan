const session = require('express-session');
const { Issuer, custom } = require('openid-client');
const logger = require('../logger');
const crypto = require('crypto');
const config = require('../config');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = new Sequelize(config.database.DB_DATABASE, config.database.DB_USER, config.database.DB_PASSWORD, {
  dialect: config.database.DB_DIALECT,
  logging: console.log,
  storage: './../database.sqlite'
});
/* const Session = sequelize.define('Session', {
  sid: {
    type: Sequelize.DataTypes.STRING,
    primaryKey: true
  },
  expires: Sequelize.DataTypes.DATE,
  data: Sequelize.DataTypes.STRING,
  createdAt: Sequelize.DataTypes.DATE,
  updatedAt: Sequelize.DataTypes.DATE
});
*/
sequelize.sync()
  .then(() => console.log('Datenbank & Tabellen erstellt!'))
  .catch(error => console.log('Fehler beim Erstellen der Datenbank & Tabellen:', error));

function generateSecretKey() {
  return crypto.randomBytes(64).toString('hex');
}

const setupSessionAndOpenID = async (app) => {
  await registerSession(app).then(() => {
    logger.info('Session setup complete');
  });
  await setupOpenID(app).then(() => {
    logger.info('Session and OpenID setup complete');
  });
};

// Register session
const registerSession = async (app) => {
  const sessionConfig = {
    secret: generateSecretKey(), // random generated key
    store: new SequelizeStore({
      db: sequelize
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  };
  app.use(session(sessionConfig));

  app.use((req, res, next) => {
    if (!req.session.data) {
      req.session.data = {}; // Initialisiere die Session
    }
    next();
  });
};
// get Issuer
const getIssuer = async (req, res) => {
  try {
    const identidyProviderIssuer = await Issuer.discover(config.auth.IDP);
    return identidyProviderIssuer;
  } catch (e) {
    res.redirect('/loginnotworking');
  }
};

// Register OpenID
const setupOpenID = async (app) => {
  // set timeout little higher default is very low
  custom.setHttpOptionsDefaults({
    timeout: 15000
  });
  // TODO try catch if issuer is not reachable or timeout (use logger.error)
  // try {
  const identidyProviderIssuer = await getIssuer(); // Issuer.discover(config.auth.IDP);

  const client = new identidyProviderIssuer.Client({
    client_id: config.auth.SSO_CLIENT_ID,
    client_secret: config.auth.SSO_CLIENT_SECRET,
    redirect_uris: [config.auth.SSO_REDIRECT_URI]
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
      config.auth.SSO_REDIRECT_URI,
      params
    );
    req.session.tokenSet = tokenSet;
    client.userinfo(req.session.tokenSet.access_token).then((userinfo) => {
      req.session.userinfo = userinfo;
      req.session.isTeach = false;
      req.session.isIntern = true;
      req.session.username = userinfo.name;
      console.log('req.session: ' + req.session +
        '\nreq.session.isIntern: ' + req.session.isIntern +
        '\nreq.session.isTeach: ' + req.session.isTeach +
        '\nreq.session.username: ' + req.session.username
      );
    });

    session.Store(req.session, (err) => {
      if (err) {
        logger.error('Error storing session: ', err);
      }
    });
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
      console.log(userinfo);
      res.send(`Welcome, ${userinfo.name} (${userinfo.email}) `);
    } else {
      res.send('You are not logged in. <a href="/login">Login</a>');
    }
  });
};

module.exports = { setupSessionAndOpenID };
