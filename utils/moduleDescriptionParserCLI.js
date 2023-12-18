const fs = require('fs');
const path = require('path');
const readAndFilterData = require(path.join(__dirname, 'moduleDescriptionParser.js'));

if (process.argv.length < 3) {
  console.log('Usage: node moduleDescriptionParserCLI.js <filename>');
  process.exit(1);
}

const inputFilePath = process.argv[2];
const searchTerm = 'Modulbeschreibung';
const dataBuffer = fs.readFileSync(inputFilePath);

readAndFilterData(dataBuffer, searchTerm).then((modules) => {
  console.dir(modules, { maxArrayLength: null });
  process.exit(0);
}).catch((error) => {
  console.error('Error while parsing the pdf file:');
  console.error(error);
  process.exit(2);
});
