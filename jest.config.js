/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testTimeout: 120000, // Timeout of 120000 milliseconds (2 minutes) for all tests
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'html']
};

module.exports = config;
