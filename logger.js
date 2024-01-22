const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const config = require('./config');

/**
 * Custom log levels for the logger.
 * @typedef {Object} CustomLevels
 * @property {number} error - Error level.
 * @property {number} warn - Warning level.
 * @property {number} info - Information level.
 * @property {number} network - Custom level for network-related events.
 * @property {number} verbose - Verbose level.
 * @property {number} debug - Debug level.
 * @property {number} silly - Silly level.
 */
const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  network: 3, // Custom level for network-related events
  database: 4, // custom level for database-related events
  verbose: 5,
  debug: 6,
  silly: 7
};
/**
 * Colors associated with custom log levels for better console output.
 * @typedef {Object} Colors
 * @property {string} error - Red color for errors.
 * @property {string} warn - Yellow color for warnings.
 * @property {string} info - Green color for information.
 * @property {string} network - Blue color for network-related events.
 * @property {string} verbose - Cyan color for verbose messages.
 * @property {string} debug - White color for debug messages.
 * @property {string} silly - Magenta color for silly messages.
 */
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  network: 'blue', // Custom color for network-related events
  database: 'blue', // Custom color for database-related events
  verbose: 'cyan',
  debug: 'grey',
  silly: 'magenta'
};
/**
 * Winston logger configuration.
 * @type {winston.Logger}
 * @namespace
 * @description Configures the logger with custom levels, colors, and transports.
 * @author Tarik Azzouzi
 */
const logger = winston.createLogger({
  levels: customLevels,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    /**
     * Console transport for logging to the console.
     * @type {winston.transports.Console}
     */
    new winston.transports.Console({
      levels: customLevels,
      level: 'silly',
      format: winston.format.combine(
        winston.format.colorize({ colors }),
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        winston.format.printf(
          (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
        )
      )
    }),
    /**
     * DailyRotateFile transport for logging combined messages to separate files.
     * @type {winston.transports.DailyRotateFile}
     */
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '300m',
      maxFiles: '7d'
    })
  ]
});
logger.debug('Debug status: ' + config.dev.DEBUG);
// If debug mode is enabled, add a DailyRotateFile transport for logging level debug-related messages.
if (config.dev.DEBUG) {
  logger.debug(
    'Debug mode enabled, adding DailyRotateFile transport for logging network-related messages and debug messages.'
  );
  /**
   * DailyRotateFile transport for logging debug-related messages.
   * @type {winston.transports.DailyRotateFile}
   */
  logger.add(
    new DailyRotateFile({
      filename: 'logs/debug-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'debug',
      zippedArchive: true,
      maxSize: '300m',
      maxFiles: '7d'
    })
  );
} else {
  logger.debug("Debug mode disabled, won't add DailyRotateFile transports.");
}

/**
 * Exports the configured logger for use in other modules.
 * @type {winston.Logger}
 */
module.exports = logger;
