// Load the environment variables from the .env file in the root of the project
require('dotenv').config();

/**
 * Configuration object for the application.
 * @typedef {Object} AppConfig
 * @property {Object} database - Database configuration.
 * @property {string} database.DB_HOST - Database host.
 * @property {string} database.DB_PASSWORD - Database password.
 * @property {string} database.DB_DATABASE - Database name.
 * @property {Object} server - Server configuration.
 * @property {number} server.PORT_HTTPS - HTTPS port.
 * @property {string} server.CERT_PATH - HTTPS certificate path.
 * @property {string} server.CERT_SECRET_PATH - HTTPS certificate secret path.
 * @property {number} server.PORT_HTTP - HTTP port.
 * @property {boolean} server.HTTP_REDIRECT - Enable HTTP redirect to HTTPS.
 * @property {boolean} server.ALLOW_HTTP - Enable HTTP.
 * @property {boolean} server.ALLOW_HTTPS - Enable HTTPS.
 * @property {string} server.HOST - Server host.
 * @property {Object} web - Web configuration.
 * @property {string} web.DEFAULT_LANGUAGE - Default language for the web.
 * @property {Object} dev - Development configuration.
 * @property {boolean} dev.DEBUG - Debug mode.
 */

// Initialize an empty config object
const config = {};

// Initialize an empty database configuration object
config.database = {};
// Set the database host, defaulting to 'localhost' if not provided
config.database.DB_HOST = process.env.DB_HOST || '127.0.0.1';
// Set the database password, defaulting to 'password' if not provided
config.database.DB_PASSWORD = process.env.DB_PASSWORD || 'password';
// Set the database name, defaulting to 'database' if not provided
config.database.DB_DATABASE = process.env.DB_DATABASE || 'database';
// Set the database user, defaulting to 'root' if not provided
config.database.DB_USER = process.env.DB_USER || 'root';
// Set the database dialect to 'mysql' or 'sqlite'
config.database.DB_DIALECT = process.env.DB_DIALECT || 'sqlite';

// Initialize an empty server configuration object
config.server = {};
// Set the server port, defaulting to 3000 if not provided
config.server.PORT_HTTPS = process.env.PORT_HTTPS || 443;
// HTTPS-Cert Path
config.server.CERT_PATH = process.env.CERT_PATH || 'certs/cert.pem';
// HTTPS-Cert Secret Path
config.server.CERT_SECRET_PATH =
  process.env.CERT_SECRET_PATH || 'certs/secret.pem';
// HTTP-Port
config.server.PORT_HTTP = process.env.PORT_HTTP || 80;
// Enable HTTP-Redirect (redirects to HTTPS)
config.server.HTTP_REDIRECT = process.env.HTTP_REDIRECT
  ? testBool(process.env.HTTP_REDIRECT)
  : true;
// Enable HTTP
config.server.ALLOW_HTTP = process.env.ALLOW_HTTP
  ? testBool(process.env.ALLOW_HTTP)
  : true;
// Enable HTTPS
config.server.ALLOW_HTTPS = process.env.ALLOW_HTTPS
  ? testBool(process.env.ALLOW_HTTPS)
  : true;
// Set the server host, defaulting to 'localhost' if not provided
config.server.HOST = process.env.HOST || 'localhost';

// Initialize an empty web configuration object
config.web = {};
// Set the default language for the web, defaulting to 'de' if not provided
config.web.DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE || 'de';

// Initialize an empty dev configuration object
config.dev = {};
config.dev.DEBUG = testBool(process.env.DEBUG) || false;

// Export the config object
module.exports = config;

/**
 * Checks a boolean text and returns the corresponding boolean value.
 *
 * @function
 * @name testBool
 * @param {string} textBool - The boolean text to check.
 * @returns {boolean} Returns `true` if the input is case-insensitively equal to 'true', otherwise `false`.
 */
function testBool(textBool) {
  // check text bool and return value (check also case-sensitivity)
  return /^true$/i.test(textBool);
}
