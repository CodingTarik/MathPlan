/* eslint-disable security/detect-non-literal-fs-filename */
// linter disabled because the filename is a command line argument and thus must be variable
const fs = require('fs');
const path = require('path');
const readAndFilterData = require(
  path.join(__dirname, 'moduleDescriptionParser.js')
);

const usageInfo = `Usage: node moduleDescriptionParserCLI.js <filename> [configuration] [--raw]

     filename: The path to the pdf file containing the module descriptions.

configuration: The path to the configuration file to be used for parsing the module descriptions.
               If not given, all known configurations are tried and the best result is returned.

        --raw: If this flag is set, the module descriptions are not parsed but the preprocessed raw text is returned. For debugging purposes.
               If this flag is set, the configuration file must not be omitted.`;

// if not enough arguments are given, print usage information
if (process.argv.length < 3) {
  console.log(usageInfo);
  process.exit(1);
}

// read arguments
if (process.argv[3] && process.argv[3].toLowerCase() === '--raw') {
  process.argv.splice(3, 0, '');
}

const inputFilePath = process.argv[2];
const configurationFilePath = process.argv[3] || undefined;
const rawDataOnly = process.argv[4]
  ? process.argv[4].toLowerCase() === '--raw'
  : false;

// open the pdf file
let dataBuffer;
try {
  dataBuffer = fs.readFileSync(inputFilePath);
} catch (error) {
  console.error('Failed to open the pdf file:', error);
  process.exit(2);
}

// invoke the module description parser and print the result
readAndFilterData(dataBuffer, configurationFilePath, rawDataOnly)
  .then((modules) => {
    console.dir(modules, { maxArrayLength: null });
    process.exit(0);
  })
  .catch((error) => {
    console.error('Parsing failed:');
    console.error(error);
    process.exit(2);
  });
