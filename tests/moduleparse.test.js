/* eslint security/detect-object-injection: "off" */

const path = require('path');
const fs = require('fs');
const readAndFilterData = require(path.join(__dirname, '../utils/moduleDescriptionParser.js'));

/**
 * @global
 * The current configuration for the module description parser as read from the module description config file.
 * @type {[{expectedModules: number, filePath: string, description: string, configPath: string}]}
 */
const INPUT_DATA = [
  {
    description: 'Modulhandbuch PO 2018',
    filePath: path.join(__dirname, 'resources/ModulhandbuchPO2018_neu_und_schn_Stand_15_Dez_21.pdf'),
    configPath: path.join(__dirname, '../utils/moduleDescriptionParserConfig/PO2018 neu und schön.json'),
    expectedModules: 226
  }
];

/**
 * @global
 * The parsed module descriptions: An array of objects, each object representing one module.
 * The array is filled by the prepareData function.
 * @type {*[]}
 */
let OUTPUT_DATA = [];

/**
 * Fills the OUTPUT_DATA array with parsed module descriptions by calling the readAndFilterData function for each input.
 * @returns {Promise<void>}
 */
async function prepareData() {

  // initialize the output data array to the same length as the input data array
  OUTPUT_DATA = Array(INPUT_DATA.length);

  // fill the output data array so that the nth entry contains the parsed module descriptions for the nth input
  for (let i = 0; i < INPUT_DATA.length; i++) {
    const input = INPUT_DATA[i];
    const dataBuffer = fs.readFileSync(input.filePath);
    OUTPUT_DATA[i] = await readAndFilterData(dataBuffer, input.configPath);
  }
}

beforeAll(async () => {
  await prepareData();
});

test('Die Anzahl geparster Module entspricht der erwarteten Anzahl', async () => {
  for (let i = 0; i < INPUT_DATA.length; i++) {
    expect(OUTPUT_DATA[i].length).toBe(INPUT_DATA[i].expectedModules);
  }
});

test('ist die Modulstruktur korrekt aufgebaut', async () => {
  for (let i = 0; i < OUTPUT_DATA.length; i++) {
    const modules = OUTPUT_DATA[i];

    for (let j = 0; j < modules.length; j++) {
      expect(modules[j]).toHaveProperty('moduleID');
      expect(modules[j]).toHaveProperty('moduleName');
      expect(modules[j]).toHaveProperty('moduleCredits');
      expect(modules[j]).toHaveProperty('moduleLanguage');
      expect(modules[j]).toHaveProperty('moduleApplicability');

      for (const property in modules[j]) { expect(typeof modules[j][property]).toBe('string'); }
    }
  }
});

test('Format von der Modulnummer korrekt', async () => {

  for (let i = 0; i < OUTPUT_DATA.length; i++) {
    const modules = OUTPUT_DATA[i];

    for (let j = 0; j < modules.length; j++) {
      expect(modules[j].moduleID).toMatch(/\d\d-\d\d-\d\d\d\d(\/(de|en))?/);
    }
  }
});

test('Format von der Creditpoints ist korrekt', async () => {

  for (let i = 0; i < OUTPUT_DATA.length; i++) {
    const modules = OUTPUT_DATA[i];

    for (let j = 0; j < modules.length; j++) {
      expect(modules[j].moduleCredits).toMatch(/\d{1,2} CP/);
    }
  }
});

test('Format von der Sprache ist korrekt', async () => {

  for (let i = 0; i < OUTPUT_DATA.length; i++) {
    const modules = OUTPUT_DATA[i];

    for (let j = 0; j < modules.length; j++) {
      expect(modules[j].moduleLanguage).toMatch(/(Englisch.*|Deutsch.*)/i);
    }
  }
});
