const fs = require('fs');
const path = require('path');
const readAndFilterData = require(
  path.join(__dirname, 'moduleDescriptionParser.js')
);

// if not enough arguments are given, print usage information
if (process.argv.length < 3) {
  console.log(
    'Usage: node moduleDescriptionParserCLI.js <filename> [configuration] [--raw]'
  );
  console.log();
  console.log(
    '       filename: The path to the pdf file containing the module descriptions.'
  );
  console.log();
  console.log(
    '  configuration: The path to the configuration file to be used for parsing the module descriptions.\n' +
      '                 If not given, all known configurations are tried and the best result is returned.'
  );
  console.log();
  console.log(
    '          --raw: If this flag is set, the module descriptions are not parsed but the preprocessed raw text is returned. For debugging purposes.\n' +
      '                 If this flag is set, the configuration file must not be omitted.'
  );
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
