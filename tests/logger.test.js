const logger = require('../logger');

describe('Logger Tests', () => {
  let consoleLogSpy = null;
  let consoleErrorSpy = null;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(global.console._stdout, 'write').mockImplementation();
    consoleErrorSpy = jest.spyOn(global.console._stderr, 'write').mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Log info console output', () => {
    const testInfoMessage = 'Info ' + Math.random() * 100000;
    logger.info(testInfoMessage);

    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls[0][0]).toContain(testInfoMessage);
  });

  test('Log verbose console output', () => {
    const testVerboseMessage = 'Verbose ' + Math.random() * 100000;
    logger.verbose(testVerboseMessage);

    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls[0][0]).toContain(testVerboseMessage);
  });

  test('Log debug console output', () => {
    const testDebugMessage = 'Debug ' + Math.random() * 100000;
    logger.debug(testDebugMessage);

    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls[0][0]).toContain(testDebugMessage);
  });

  test('Log error console output', () => {
    const testErrorMessage = 'Error ' + Math.random() * 100000;
    logger.error(testErrorMessage);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain(testErrorMessage);
  });

  test('Log error file output', async () => {
    const testErrorMessage = 'Error ' + Math.random() * 100000;
    logger.error(testErrorMessage);

    // Wait for logger to finish writing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Read the log file content
    const fs = require('fs');
    const path = require('path');
    const logFiles = fs.readdirSync(path.join(__dirname, '..', 'logs')).filter((file) => file.startsWith('combined'));
    let logFileContent = '';
    logFiles.forEach((file) => {
      logFileContent += fs.readFileSync(path.join(__dirname, '..', 'logs', file)).toString();
    });

    // Assert that the file contains the expected error message
    expect(logFileContent).toContain(testErrorMessage);
  });

  test('Log with metadata', () => {
    const testMessage = 'Log with metadata ' + Math.random() * 100000;
    const metadata = { key: 'value', number: 42 };
    logger.info(testMessage, { metadata });

    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls[0][0]).toContain(testMessage);
  });
});
