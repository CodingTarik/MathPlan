const pdf = require('pdf-parse');

module.exports = readAndFilterData;

// TODO: Diese Infos ggf. aus Konfigurationsdatei einlesen?

// properties to be extracted from the module description
// propertyName: name of the property in the resulting object
// property can be found in the module description between readFrom and readTo (both exclusive)
// if excess is given, the specified characters will be removed from the property value after extraction
const moduleProperties = [
  {
    propertyName: 'moduleID',
    readFrom: 'Modul Nr.',
    readTo: 'Creditpoints',
    excess: ['\\s']
  },
  {
    propertyName: 'moduleName',
    readFrom: 'Modulname',
    readTo: 'Modul'
  },
  {
    propertyName: 'moduleCredits',
    readFrom: 'Modul Nr.',
    readTo: 'Arbeitsaufwand',
    excess: ['^.*Creditpoints\\s']
  },
  {
    propertyName: 'moduleLanguage',
    readFrom: '([sS]emester|Verwendbarkeit|[Uu]nregelmäßig) Sprache',
    readTo: 'Modulverantwortliche'
  },
  {
    propertyName: 'moduleApplicability',
    readFrom: 'Verwendbarkeit des Moduls',
    readTo: '9 Literatur'
  }
];

/**
 * Parses the properties specified in "moduleProperties" from the given data buffer.
 *
 * @param {Buffer} dataBuffer The data buffer of the pdf file to be parsed.
 * @param {string} searchTerm The search term to be used to check if the data buffer contains module information.
 * @returns {Promise<Array>} The parsed module descriptions: An array of objects, each object representing one module.
 */
async function readAndFilterData(dataBuffer, searchTerm) {
  try {
    // read content from pdf file
    const data = await pdf(dataBuffer);

    // extract text from pdf and do some preprocessing
    const pdfText = moduleDescriptionsPreprocessing(data.text);

    // TODO: searchTerm wieder entfernen? Sehe den Sinn nicht so ganz...
    // filter text for searchTerm
    if (!pdfText.includes(searchTerm)) {
      throw new Error(`Search term ${searchTerm} not found in data buffer!`);
    }

    // count number of modules
    const numberOfModules = (pdfText.match(/Modulbeschreibung/g) || []).length;
    if (numberOfModules === 0) {
      throw new Error('No modules found in data buffer!');
    }

    // collect all module properties into one array per property
    const parsedProperties = parseProperties(pdfText, numberOfModules);

    // build target objects from parsed properties
    return buildModules(parsedProperties, numberOfModules);
  } catch (error) {
    console.error('Error while parsing the pdf file:', error);
  }
}

/**
 * Collects all module properties into one array per property.
 *
 * @param pdfText The preprocessed text of the pdf file to be parsed.
 * @param numberOfModules The number of modules expected.
 * @returns {Object} An object containing one array per module property.
 */
function parseProperties(pdfText, numberOfModules) {
  const parsedProperties = {};

  for (const property of moduleProperties) {
    parsedProperties[property.propertyName] = filterAndAppendNextWords(
      pdfText,
      property.readFrom,
      property.readTo
    );

    if (parsedProperties[property.propertyName].length !== numberOfModules) {
      throw new Error(
        `Number of parsed ${property.propertyName} (${
          parsedProperties[property.propertyName].length
        }) does not match number of modules (${numberOfModules})!`
      );
    }
  }
  return parsedProperties;
}

/**
 * Builds the target objects from the parsed properties.
 *
 * @param parsedProperties The parsed properties, an object containing one array per module property.
 * @param numberOfModules The number of modules expected.
 * @returns {Array} An array of objects, each object representing one module.
 */
function buildModules(parsedProperties, numberOfModules) {
  const modules = [];
  for (let i = 0; i < numberOfModules; i++) {
    const module = {};
    for (const property of moduleProperties) {
      let parsedProperty = parsedProperties[property.propertyName][i];

      // if needed, remove excess characters from property value
      if (property.excess) {
        for (const excess of property.excess) {
          parsedProperty = parsedProperty.replace(new RegExp(excess), '');
        }
      }

      module[property.propertyName] = parsedProperty;
    }
    modules.push(module);
  }
  return modules;
}

/**
 * Preprocesses the module descriptions: harmonizes whitespaces and removes line breaks.
 * @param moduleDescriptions The un-preprocessed module descriptions text.
 * @returns {string} The preprocessed module descriptions text.
 */
function moduleDescriptionsPreprocessing(moduleDescriptions) {
  moduleDescriptions = moduleDescriptions
    .replace(/(\r\n|\n|\r)/gm, ' ') // remove line breaks
    .replace(/\s+/g, ' ') // harmonize spaces
    .replace(/Arbeits aufwand/g, 'Arbeitsaufwand'); // fix additional line break in Arbeitsaufwand

  return moduleDescriptions;
}

/**
 * Filters the given originalString for all matches of readFrom ... readTo.
 *
 * @param originalString The string to be filtered.
 * @param readFrom The start of the match to be filtered.
 * @param readTo The end of the match to be filtered.
 * @returns {Array} An array of all matches.
 */
function filterAndAppendNextWords(originalString, readFrom, readTo) {
  // Escape special characters in search terms
  readFrom = toRegexString(readFrom);
  readTo = toRegexString(readTo);

  // Find all matches of readFrom ... readTo
  const regex = new RegExp(`${readFrom}.*?${readTo}`, 'gm');
  const matches = originalString.match(regex);

  if (matches === null) {
    return [];
  }

  // Remove searchTerm and keyWordBis from matches
  for (let i = 0; i < matches.length; i++) {
    matches[i] = matches[i].replace(new RegExp(`^${readFrom}`), '');
    matches[i] = matches[i].replace(new RegExp(`${readTo}$`), '');
    matches[i] = matches[i].trim();
  }

  return matches;
}

/**
 * Helper function to escape special characters in a string so that the string becomes a valid RegEx.
 *
 * @param str The string to be escaped.
 * @returns {string} The escaped string.
 */
function toRegexString(str) {
  return str.replace(/\./g, '\\.');
}