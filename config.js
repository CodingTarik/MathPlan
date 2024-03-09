// Load the environment variables from the .env file in the root of the project
require('dotenv').config();

/**
 * Configuration object for the application.
 * @typedef {Object} AppConfig
 * @property {Object} database - Database configuration.
 * @property {string} database.DB_HOST - Database host.
 * @property {string} database.DB_USER - Database user.
 * @property {string} database.DB_DIALECT - Database dialect. Currently supports 'mysql' and 'sqlite'.
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
 * @property {string} web.PAGE_NAME - Name of the application shown in navbar and on startpage.
 * @property {boolean} web.FAQ_STARTPAGE_ACTIVE - Enable FAQ on startpage.
 * @property {boolean} web.FAQ_URL_ACTIVE - Enable FAQ in menu banner.
 * @property {string} web.FAQ_URL - FAQ URL.
 * @property {string} web.SUPPORT_RESPONSIBLE - The person or group responsible for this application.
 * @property {boolean} web.SUPPORT_EMAIL_ACTIVE - Enable support email in footer.
 * @property {string} web.SUPPORT_EMAIL - Support email.
 * @property {boolean} web.SUPPORT_LINK_ACTIVE - Enable support link in footer.
 * @property {string} web.SUPPORT_LINK - Support link (e.g. a contact form).
 * @property {string} web.IMPRINT_URL - Imprint URL.
 * @property {string} web.PRIVACY_POLICY_URL - Privacy policy URL.
 * @property {boolean} web.SOCIAL_MEDIA_ACTIVE - Enable social media links in footer.
 * @property {string} web.FACEBOOK_URL - Facebook URL.
 * @property {string} web.TWITTER_URL - Twitter URL.
 * @property {string} web.INSTAGRAM_URL - Instagram URL.
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
// the faq url the website will redirect if faq_url_activate is active
config.web.FAQ_URL = process.env.FAQ_URL || 'www.example.org';
// page name
config.web.PAGE_NAME = process.env.PAGE_NAME || 'MathPlan';
// support: responsible person or group
config.web.SUPPORT_RESPONSIBLE = process.env.SUPPORT_RESPONSIBLE;
// support email for footer
config.web.SUPPORT_EMAIL_ACTIVE = testBool(process.env.SUPPORT_EMAIL_ACTIVE);
config.web.SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'example@example.com';
// support link for footer
config.web.SUPPORT_LINK_ACTIVE = testBool(process.env.SUPPORT_LINK_ACTIVE);
config.web.SUPPORT_LINK = process.env.SUPPORT_LINK || 'www.example.com';
// defined if faq item in menu banner is activate redirects to faq_url
config.web.FAQ_URL_ACTIVE = testBool(process.env.FAQ_URL_ACTIVE);
// Defines if faq on startpage is active
config.web.FAQ_STARTPAGE_ACTIVE = testBool(process.env.FAQ_STARTPAGE_ACTIVE);
// imprint url for redirect
config.web.IMPRINT_URL = process.env.IMPRINT_URL || 'https://example.com';
// privacy policy url for redirect
config.web.PRIVACY_POLICY_URL =
  process.env.PRIVACY_POLICY_URL || 'https://example.com';
// social media links for footer
config.web.SOCIAL_MEDIA_ACTIVE = testBool(process.env.SOCIAL_MEDIA_ACTIVE);
// social media links
config.web.FACEBOOK_URL =
  process.env.FACEBOOK_URL || 'https://www.facebook.com/';
config.web.TWITTER_URL = process.env.TWITTER_URL || 'https://twitter.com/';
config.web.INSTAGRAM_URL =
  process.env.INSTAGRAM_URL || 'https://www.instagram.com/';
// Initialize an empty dev configuration object
config.dev = {};
config.dev.DEBUG = testBool(process.env.DEBUG) || false;

/**
 * For more information on the security headers, see:
 * @see {@link https://owasp.org/www-project-secure-headers/index.html#configuration-proposal}
 * @see {@link https://helmetjs.github.io/#reference}
 * */
const securityHeaderConfig = {
  contentSecurityPolicy: {
    /**
     * Content Security Policy (CSP) Configuration
     *
     * @description Defines security policies for various content on a web page.
     * @policy
     * @directive script-src 'self' 'sha256-GC6sqCnhg9h2PIYTnsmfFvS16ZCgwoa54eMaC8jr/Zw=';
     *           // Allows scripts from the same origin (the domain of the web page).
     *           // Allows scripts with the specified hash (the inline script in the index.ejs)
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
      'script-src': [
        "'self'",
        "'sha256-IDUqR6tWhL1G3sb2OcqoFkgpOOaNXEb5Ey7yfuaH8xU='"
      ],
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
 * @function
 * @name testBool
 * @param {string} textBool - The boolean text to check.
 * @returns {boolean} Returns `true` if the input is case-insensitively equal to 'true', otherwise `false`.
 */
function testBool(textBool) {
  // check text bool and return value (check also case-sensitivity)
  return /^true$/i.test(textBool);
}
