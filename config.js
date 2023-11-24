
// load the environment variables from the .env file in the root of the project
require('dotenv').config();

// Initialize an empty config object
var config = {};

// Initialize an empty database configuration object
config.database = {}
// Set the database host, defaulting to 'localhost' if not provided
config.database.DB_HOST = process.env.DB_HOST || '127.0.0.1';
// Set the database password, defaulting to 'password' if not provided
config.database.DB_PASSWORD = process.env.DB_PASSWORD || '2eu889';
// Set the database name, defaulting to 'database' if not provided
config.database.DB_DATABASE = process.env.DB_DATABASE || 'data_app';
// Set the database user, defaulting to 'root' if not provided
config.database.DB_USER = process.env.DB_USER || 'root';
console.log(process.env.DB_USER)
console.log(process.env.DB_HOST)
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_DATABASE) 

// Initialize an empty server configuration object
config.server = {};
// Set the server port, defaulting to 3000 if not provided
config.server.PORT_HTTPS = process.env.PORT_HTTPS || 443;
// HTTPS-Cert Path
config.server.CERT_PATH = process.env.CERT_PATH || 'certs/cert.pem';
// HTTPS-Cert Secret Path
config.server.CERT_SECRET_PATH = process.env.CERT_SECRET_PATH || 'certs/secret.pem';
// HTTP-Port
config.server.PORT_HTTP = process.env.PORT_HTTP || 80;
// Enable HTTP-Redirect (redirects to HTTPS)
config.server.HTTP_REDIRECT = process.env.HTTP_REDIRECT ? testBool(process.env.HTTP_REDIRECT) : true; 
// Enable HTTP
config.server.ALLOW_HTTP = process.env.ALLOW_HTTP ? testBool(process.env.ALLOW_HTTP) : true;
// Enable HTTPS
config.server.ALLOW_HTTPS = process.env.ALLOW_HTTPS ? testBool(process.env.ALLOW_HTTPS) : true;
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

function testBool(textBool) {
    // check text bool and return value (check also case-sensitivity)
    return /^true$/i.test(textBool);
}