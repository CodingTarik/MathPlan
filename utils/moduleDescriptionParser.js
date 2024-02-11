const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('node:path');

/**
 * @global
 * The current configuration for the module description parser as read from the module description config file.
 */
let config = {};

/**
 * @global
 * The folder containing the module description configuration files.
 * If no configuration file is given to the module description parser, all files in this folder are available for selection.
 */
const CONFIG_FOLDER = path.join(__dirname, 'moduleDescriptionParserConfig');

/**
 * Helper function:
 * Returns an array of all available module description configuration file paths in the CONFIG_FOLDER.
 * @returns {Array} An array of all available module description configuration file paths.
 */
function getAvailableConfigFiles() {
  const configFilePaths = [];
  for (const file of fs.readdirSync(CONFIG_FOLDER)) {
    if (file.endsWith('.json')) {
      configFilePaths.push(path.join(CONFIG_FOLDER, file));
    }
  }
  return configFilePaths;
}

/**
 * Helper function:
 * Reads the module description configuration file with the given name from the CONFIG_FOLDER
 * and stores the configuration in the global variable "config".
 * @param configPath The path to the module description configuration file to be read.
 * @returns {void}
 * @throws {Error} If the configuration file cannot be accessed or parsed.
 */
function readConfigFile(configPath) {
  let fileContent;

  try {
    fileContent = fs.readFileSync(configPath);
  } catch (error) {
    throw new Error(
      `Error while accessing the configuration file ${configPath}: ${error.message}`
    );
  }

  try {
    config = JSON.parse(fileContent);
  } catch (error) {
    throw new Error(
      `Error while parsing the configuration file ${configPath}: ${error.message}`
    );
  }
}

/**
 * Parses the properties specified in "moduleProperties" from the given data buffer.
 *
 * @param {Buffer} dataBuffer The data buffer of the pdf file to be parsed.
 * @param {string} configPath The path to the module description configuration file to be used for parsing.
 * @param {boolean} rawDataOnly If true, the module descriptions are not parsed but the preprocessed raw text is returned. For debugging and development purposes.
 * @returns {Promise<Array>} The parsed module descriptions: An array of objects, each object representing one module.
 */
async function readAndFilterData(dataBuffer, configPath, rawDataOnly = false) {
  // read the content from the given data buffer (pdf file)
  let data;
  try {
    data = await pdf(dataBuffer);
  } catch (error) {
    throw new Error(`Failed to read the PDF file: ${error.message}`);
  }

  return parseModuleDescriptionsWithConfig(data.text, configPath).data;

  // load the configuration file
  readConfigFile(configPath);

  // extract text from pdf (with pdf-parse) and do preprocessing
  const moduleDescriptionTexts = moduleDescriptionsPreprocessing(data.text);

  // if rawDataOnly is true, return the preprocessed raw text
  if (rawDataOnly) {
    return moduleDescriptionTexts;
  }

  // parse each module description
  const parsedModules = [];

  return parsedModules;
}

/**
 * Parses given pdfText with a specified configuration file and calculates the total parser score.
 * @param {string} pdfText The text of the pdf file to be parsed.
 * @param {string} configPath The path to the module description configuration file to be used for parsing.
 * @returns {{totalParserScore: number, data: *[], configPath: string}} An object containing the parsed module descriptions, the total parser score and the name of the used configuration file.
 */
function parseModuleDescriptionsWithConfig(pdfText, configPath) {
  // load the configuration file
  readConfigFile(configPath);

  // do preprocessing on the module descriptions
  moduleDescriptionTexts = moduleDescriptionsPreprocessing(pdfText);

  // parse each module description and calculate the total parser score
  let totalScore = 0;
  const parsedModules = [];

  for (const singleModuleDescription of moduleDescriptionTexts) {
    const parsedModule = parseSingleModuleDescription(singleModuleDescription);
    totalScore += parsedModule.parserScore;
    parsedModules.push(parsedModule);
  }

  totalScore += parsedModules.length;

  return {
    data: parsedModules,
    totalParserScore: totalScore,
    configPath: path.basename(configPath)
  };
}

/**
 * Helper function:
 * Extracts the properties (as specified in "moduleProperties" in the config object) from the given input string.
 * For each item of moduleProperties, the function searches for the specified readFrom ... readTo and extracts the text in between.
 * If more than one match is found, the function uses the result at the specified index (useResultAtIndex).
 * If specified, the function applies additional postprocessing to the extracted text.
 * The extracted text is added as a property with the specified name (propertyName) to the module object.
 * The function also adds a property "parserScore" to the module object, which is used to filter out implausible results.
 *
 * @param moduleDescriptionText {string} A string representing the module description.
 * @returns {{}} An object containing the extracted properties and thus representing one module.
 */
function parseSingleModuleDescription(moduleDescriptionText) {
  // initialize an empty module object
  const module = {};
  let score = 0;

  for (const propertyToExtract of config.moduleProperties) {
    // find the correct match of readFrom ... readTo
    const matches = findKeywordMatches(
      moduleDescriptionText,
      propertyToExtract.readFrom,
      propertyToExtract.readTo,
      propertyToExtract.keepReadFromAndTo
    );
    let extractedText = matches[propertyToExtract.useResultAtIndex] || '';

    // if needed, do additional postprocessing as specified in config
    if (propertyToExtract.postprocessing) {
      for (const findAndReplaceItem of propertyToExtract.postprocessing) {
        extractedText = extractedText.replace(
          new RegExp(findAndReplaceItem.find, findAndReplaceItem.flags),
          findAndReplaceItem.replace
        );
      }
    }

    // add the extracted text as a property to the module object
    module[propertyToExtract.propertyName] = extractedText;

    // plausibility-check the extracted property
    if (!extractedPropertyIsPlausible(propertyToExtract, extractedText)) {
      score--;
    }
  }

  // add the score as a property to the module object
  module['parserScore'] = score;

  return module;
}

/**
 * Helper function:
 * Checks if the extracted property is plausible.
 * @param {object} propertyToExtract The configuration of the property to be extracted (from the config object).
 * @param {string} extractedProperty The extracted property text.
 * @returns {boolean}
 */
function extractedPropertyIsPlausible(propertyToExtract, extractedProperty) {
  if (propertyToExtract.plausibilityCheck) {
    // if a plausibility check is specified in the config, apply it
    if (!extractedProperty.match(propertyToExtract.plausibilityCheck)) {
      return false;
    }
  } else {
    // if no plausibility check is specified, check if the property is not empty and not too long
    return extractedProperty.length > 0 && extractedProperty.length < 500;
  }
  return true;
}

/**
 * Helper function:
 * Preprocesses the module descriptions
 * - harmonizes whitespaces and removes line breaks if enableDefaultPreprocessing is true in config
 * - applies additional preprocessing (find and replace) as specified in config
 * @param moduleDescriptions The un-preprocessed module descriptions text.
 * @returns {[string]} An array of preprocessed module descriptions. Each array entry contains the text of exactly one module description.
 */
function moduleDescriptionsPreprocessing(moduleDescriptions) {
  // default preprocessing if enabled in config
  if (config.enableDefaultPreprocessing) {
    moduleDescriptions = moduleDescriptions
      .replace(/(\r\n|\n|\r)/gm, ' ') // remove line breaks
      .replace(/\s+/g, ' '); // harmonize spaces
  }

  // additional preprocessing as specified in config
  for (const findAndReplaceItem of config.additionalPreprocessing) {
    moduleDescriptions = moduleDescriptions.replace(
      new RegExp(findAndReplaceItem.find, findAndReplaceItem.flags),
      findAndReplaceItem.replace
    );
  }

  // split the text: each array entry contains the text of exactly one module description
  const moduleDescriptionTexts = moduleDescriptions.split(config.moduleTitle);

  // remove the first entry, as it just contains all the text before the first module description
  moduleDescriptionTexts.shift();

  return moduleDescriptionTexts;
}

/**
 * Helper function:
 * Filters the given originalString for all matches of readFrom ... readTo.
 * The function returns an array of all matches found or an empty array if no matches are found.
 *
 * @param originalString {string} The string to be filtered.
 * @param readFrom {string} The start of the match to be filtered.
 * @param readTo {string} The end of the match to be filtered.
 * @param keepReadFromAndTo {boolean} Iff true, the readFrom and readTo strings are kept in the result.
 * @returns {Array} An array of all matches.
 */
function findKeywordMatches(
  originalString,
  readFrom,
  readTo,
  keepReadFromAndTo
) {
  // Find all matches of readFrom ... readTo
  const regex = new RegExp(`${readFrom}.*?${readTo}`, 'gm');
  const matches = originalString.match(regex);

  if (matches === null) {
    return [];
  }

  // Remove readFrom and readTo from matches if wanted
  if (!keepReadFromAndTo) {
    for (let i = 0; i < matches.length; i++) {
      matches[i] = matches[i].replace(new RegExp(`^${readFrom}`), '');
      matches[i] = matches[i].replace(new RegExp(`${readTo}$`), '');
      matches[i] = matches[i].trim();
    }
  }

  return matches;
}

module.exports = readAndFilterData;
