// Libaries
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const fs = require('fs');

// Config
const config = require(path.join(__dirname, 'config.js'));

// Router
const api = require(path.join(__dirname, 'routes/api'));
const pages = require(path.join(__dirname, 'routes/pages'));

// Objects
const app = express();

/**
 * Middleware that logs HTTP requests if the application is in debug mode.
 * @function
 * @name logRequests
 */
const logRequests = morgan('dev');

// Register logger for debug mode
if (config.dev.DEBUG) {
  app.use(logRequests);
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
app.use(
  '/assets/select2',
  express.static(path.join(__dirname, 'node_modules/select2/dist'))
);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routing
app.use('/api', api);
app.use('/', pages);

// test needs to be checked, to not start server for testing framework jest
if (process.env.NODE_ENV !== 'test') {
  // HTTP-Server
  if (config.server.ALLOW_HTTP) {
    let httpServer = null;
    // Redirect HTTP to HTTPS if enabled
    if (config.HTTP_REDIRECT) {
      httpServer = http.createServer((req, res) => {
        res.writeHead(301, {
          Location:
            'https://' + config.server.host + ':' + config.PORT_HTTPS + req.url
        });
        res.end();
      });
    } else {
      // Start HTTP server with APP
      httpServer = http.createServer(app);
    }

    // listen on http port
    httpServer.listen(config.server.PORT_HTTP, () => {
      console.log(
        `Die Anwendung ist auf http://${config.server.HOST}:${config.server.PORT_HTTP} verfügbar.`
      );
    });
  }

  // HTTPS-Server
  /* eslint-disable security/detect-non-literal-fs-filename */
  if (config.server.ALLOW_HTTPS) {
    /**
     * Options for the HTTPS server.
     * @type {Object}
     * @property {string} key - SSL certificate key.
     * @property {string} cert - SSL certificate.
     */
    const options = {
      key: fs.readFileSync(config.server.CERT_PATH, 'utf8'),
      cert: fs.readFileSync(config.server.CERT_SECRET_PATH, 'utf8')
    };
    /* eslint-enable security/detect-non-literal-fs-filename */

    https.createServer(options, app).listen(config.server.PORT_HTTPS, () => {
      console.log(
        `Die Anwendung ist auf https://${config.server.HOST}:${config.server.PORT_HTTPS} verfügbar.`
      );
    });
  }
}
module.exports.app = app;
