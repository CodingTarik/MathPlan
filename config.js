// load the environment variables from the .env file in the root of the project
require('dotenv').config();

// Initialize an empty config object
const config = {};

// Initialize an empty database configuration object
config.database = {};
// Set the database host, defaulting to 'localhost' if not provided
config.database.DB_HOST = process.env.DB_HOST || 'localhost';
// Set the database password, defaulting to 'password' if not provided
config.database.DB_PASSWORD = process.env.DB_PASSWORD || 'password';
// Set the database name, defaulting to 'database' if not provided
config.database.DB_DATABASE = process.env.DB_DATABASE || 'database';

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

const securityHeaderConfig = {
  contentSecurityPolicy: {
    /**
     * Content Security Policy (CSP) Configuration
     *
     * @description Defines security policies for various content on a web page.
     * @policy
     * @directive default-src 'self';
     *            // Allows content only from the same origin (the domain of the web page).
     *
     * @directive form-action 'self';
     *            // Restricts form submissions to URLs from the same origin.
     *
     * @directive object-src 'none';
     *            // Disallows the use of <object> elements and object embeddings.
     *
     * @directive frame-ancestors 'none';
     *            // Prevents the web page from being embedded within an iframe.
     *
     * @directive block-all-mixed-content;
     *            // Blocks loading of any mixed content (both secure and non-secure).
     *            // Ensures that all resources are served over a secure connection (HTTPS).
     */
    directives: {
      // Added inlinescript hash for Cross-Site-Policy
      'script-src': ["'self'", "'sha256-GC6sqCnhg9h2PIYTnsmfFvS16ZCgwoa54eMaC8jr/Zw='"],
      'default-src': ["'self'"],
      'form-action': ["'self'"],
      'object-src': ["'none'"],
      'frame-ancestors': ["'none'"],
      'block-all-mixed-content': []
    }
  },

  // Sets "Cross-Origin-Embedder-Policy: require-corp"
  /* "A document can only load resources from the same origin, or resources explicitly
  marked as loadable from another origin. If a cross origin resource supports CORS,
  the crossorigin attribute or the Cross-Origin-Resource-Policy header must be used to
  load it without being blocked by COEP."" */
  crossOriginEmbedderPolicy: true,
  // Sets "Cross-Origin-Opener-Policy: same-origin"
  // This header prevents a page from being opened in a cross-origin iframe.
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  // Sets "Cross-Origin-Resource-Policy: same-origin"
  // This header prevents a page from loading any cross-origin resources that don’t explicitly grant permission.
  crossOriginResourcePolicy: { policy: 'same-origin' }
};
// sets securityheader
config.server.HELMET = securityHeaderConfig;
// Export the config object
module.exports = config;

/**
 * Checks a boolean text and returns the corresponding boolean value.
 *
 * @function testBool
 * @param {string} textBool - The boolean text to check.
 * @returns {boolean} Returns `true` if the input is case-insensitively equal to 'true', otherwise `false`.
 */
function testBool(textBool) {
  // check text bool and return value (check also case-sensitivity)
  return /^true$/i.test(textBool);
}
