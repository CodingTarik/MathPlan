// Libaries
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const fs = require('fs');
const logger = require('./logger');
const chalk = require('chalk');

// Config
const config = require(path.join(__dirname, 'config.js'));

// Router
const api = require(path.join(__dirname, 'routes/api'));
const pages = require(path.join(__dirname, 'routes/pages'));

// Objects
const app = express();

// Register logger for network requests
if (config.dev.DEBUG) {
  const morganStream = {
    write: (message) => {
      logger.network(message.trim());
    }
  };
  app.use(morgan('dev', { stream: morganStream }));
}

// Static assets
app.use('/assets', express.static('public'));
app.use(
  '/assets/bootstrap',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist'))
);
app.use(
  '/assets/jquery',
  express.static(path.join(__dirname, 'node_modules/jquery/dist'))
);
app.use(
  '/assets/fontawesome',
  express.static(path.join(__dirname, '/node_modules/font-awesome'))
);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routing
app.use('/', pages);
app.use('/api', api);

try {
  if (process.env.NODE_ENV !== 'test') {
    // HTTP-Server
    if (config.server.ALLOW_HTTP) {
      let httpServer = null;
      if (config.HTTP_REDIRECT) {
        httpServer = http.createServer((req, res) => {
          res.writeHead(301, {
            Location:
              'https://' +
              config.server.host +
              ':' +
              config.PORT_HTTPS +
              req.url
          });
          res.end();
        });
      } else {
        httpServer = http.createServer(app);
      }

      httpServer.listen(config.server.PORT_HTTP, () => {
        logger.info(
          `Die Anwendung ist auf ${chalk.cyanBright(
            `http://${config.server.HOST}:${config.server.PORT_HTTP}`
          )} verfügbar.`
        );
      });
    }

    // HTTPS-Server
    /* eslint-disable security/detect-non-literal-fs-filename */
    if (config.server.ALLOW_HTTPS) {
      const options = {
        key: fs.readFileSync(config.server.CERT_PATH, 'utf8'),
        cert: fs.readFileSync(config.server.CERT_SECRET_PATH, 'utf8')
      };
      /* eslint-enable security/detect-non-literal-fs-filename */

      https.createServer(options, app).listen(config.server.PORT_HTTPS, () => {
        logger.info(
          chalk.green(
            `Die Anwendung ist auf ${chalk.cyanBright(
              `https://${config.server.HOST}:${config.server.PORT_HTTPS}`
            )} verfügbar.`
          )
        );
      });
    }
  }
} catch (ex) {
  // if an fatal error occurs, log it and exit the application
  logger.error(ex);
}

module.exports.app = app;
