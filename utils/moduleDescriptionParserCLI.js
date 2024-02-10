const fs = require('fs');
const path = require('path');
const readAndFilterData = require(
  path.join(__dirname, 'moduleDescriptionParser.js')
);

// if not enough arguments are given, print usage information
if (process.argv.length < 4) {
  console.log(
    'Usage: node moduleDescriptionParserCLI.js <filename> <configuration>'
  );
  console.log(
    '  filename:      The path to the pdf file containing the module descriptions.'
  );
  console.log(
    '  configuration: The path to the configuration file to be used for parsing the module descriptions.'
  );
  process.exit(1);
}

// read arguments
const inputFilePath = process.argv[2];
const configurationFilePath = process.argv[3];

// open the pdf file
let dataBuffer;
try {
  dataBuffer = fs.readFileSync(inputFilePath);
} catch (error) {
  console.error('Failed to open the pdf file:', error);
  process.exit(2);
}

// invoke the module description parser and print the result
readAndFilterData(dataBuffer, configurationFilePath)
  .then((modules) => {
    console.dir(modules, { maxArrayLength: null });
    process.exit(0);
  })
  .catch((error) => {
    console.error('Parsing failed:');
    console.error(error);
    process.exit(2);
  });
