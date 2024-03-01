/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testTimeout: 30000, // Timeout of 30000 milliseconds (30 seconds) for all tests
    collectCoverage: true,
    coverageReporters: ['lcov', 'text', 'html'], 
  };
  
  module.exports = config;