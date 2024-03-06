/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint security/detect-object-injection: "off" */
// linter disabled because the input data should be easily configurable. This is done via the INPUT_DATA array.

const { describe, expect, test } = require('@jest/globals');

const path = require('path');
const fs = require('fs');
const readAndFilterData = require(
  path.join(__dirname, '../utils/moduleDescriptionParser.js')
);

/**
 * @global
 * The fault tolerance for implausible parsed module properties.
 * A value of 0 means that no implausible properties are tolerated.
 * A value of 0.5 means that 50% of the parsed properties may be implausible.
 * A value of 1 means that all parsed properties may be implausible so in this case, implausible properties are ignored.
 * @type {number}
 */
const PLAUSIBILITY_CHECK_TOLERANCE = 0;

/**
 * @global
 * The current configuration for the module description parser as read from the module description config file.
 * @type {[{expectedModules: number, filePath: string, description: string, configPath: string}]}
 */
const INPUT_DATA = [
  {
    description: 'Modulhandbuch PO 2018',
    filePath: path.join(__dirname, 'resources/Modulhandbuch PO2018.pdf'),
    configPath: path.join(
      __dirname,
      '../utils/moduleDescriptionParserConfig/PO2018 neu und schön.json'
    ),
    expectedModules: 226
  },
  {
    description: 'TUCaN-Beispiel',
    filePath: path.join(__dirname, 'resources/Modulhandbuch TUCaN-Muster.pdf'),
    configPath: path.join(
      __dirname,
      '../utils/moduleDescriptionParserConfig/TUCaN-Standardformat.json'
    ),
    expectedModules: 1
  },
  {
    description: 'Gesamtmodulhandbuch WS 2023/24',
    filePath: path.join(
      __dirname,
      'resources/Modulhandbuch gesamt WS23-24.pdf'
    ),
    configPath: path.join(
      __dirname,
      '../utils/moduleDescriptionParserConfig/TUCaN-Standardformat.json'
    ),
    expectedModules: 456
  },
  {
    description: 'Gesamtmodulhandbuch WS 2023/24 englisch',
    filePath: path.join(
      __dirname,
      'resources/Modulhandbuch englisch gesamt WS23-24.pdf'
    ),
    configPath: path.join(
      __dirname,
      '../utils/moduleDescriptionParserConfig/TUCaN-Standardformat englisch.json'
    ),
    expectedModules: 456
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

      for (const property in modules[j]) {
        if (property === 'parserScore') {
          expect(modules[j][property]).toBeLessThanOrEqual(0);
          expect(modules[j][property]).toBeGreaterThanOrEqual(-5);
          continue;
        }
        expect(typeof modules[j][property]).toBe('string');
      }
    }
  }
});

test('Format von der Modulnummer korrekt', async () => {
  for (let i = 0; i < OUTPUT_DATA.length; i++) {
    const modules = OUTPUT_DATA[i];

    let errorCounter = 0;
    for (let j = 0; j < modules.length; j++) {
      // linter disabled because this regex does not seem to be unsafe
      // eslint-disable-next-line security/detect-unsafe-regex
      if (!modules[j].moduleID.match(/^\d\d-\d\d-\d\d\d\d(\/\w+)?$/)) {
        errorCounter++;
      }
    }
    expect(errorCounter).toBeLessThanOrEqual(
      PLAUSIBILITY_CHECK_TOLERANCE * INPUT_DATA[i].expectedModules
    );
  }
});

test('Format von der Creditpoints ist korrekt', async () => {
  for (let i = 0; i < OUTPUT_DATA.length; i++) {
    const modules = OUTPUT_DATA[i];

    let errorCounter = 0;
    for (let j = 0; j < modules.length; j++) {
      if (!modules[j].moduleCredits.match(/^\d{1,2} CP$/)) errorCounter++;
    }
    expect(errorCounter).toBeLessThanOrEqual(
      PLAUSIBILITY_CHECK_TOLERANCE * INPUT_DATA[i].expectedModules
    );
  }
});

test('Format von der Sprache ist korrekt', async () => {
  for (let i = 0; i < OUTPUT_DATA.length; i++) {
    const modules = OUTPUT_DATA[i];

    let errorCounter = 0;
    for (let j = 0; j < modules.length; j++) {
      if (
        !modules[j].moduleLanguage.match(
          /^(Englisch.*|Deutsch.*|English.*|German.*)/i
        )
      ) {
        errorCounter++;
      }
    }
    expect(errorCounter).toBeLessThanOrEqual(
      PLAUSIBILITY_CHECK_TOLERANCE * INPUT_DATA[i].expectedModules
    );
  }
});

test('Module description config may be omitted', async () => {
  for (let i = 0; i < INPUT_DATA.length; i++) {
    const input = INPUT_DATA[i];
    const dataBuffer = fs.readFileSync(input.filePath);
    const result = await readAndFilterData(dataBuffer);
    expect(result).toStrictEqual(OUTPUT_DATA[i]);
  }
});

test('Test raw data output', async () => {
  for (let i = 0; i < INPUT_DATA.length; i++) {
    const input = INPUT_DATA[i];
    const dataBuffer = fs.readFileSync(input.filePath);
    const rawData = await readAndFilterData(dataBuffer, input.configPath, true);
    expect(Array.isArray(rawData)).toBe(true);
    expect(rawData.length).toBe(input.expectedModules);

    for (let j = 0; j < rawData.length; j++) {
      expect(typeof rawData[j]).toBe('string');
      expect(rawData[j]).not.toHaveLength(0);
    }
  }
});

test('Test if the debug logs can be disabled', async () => {
  const logSpy = jest.spyOn(console, 'log');
  const dataBuffer = fs.readFileSync(INPUT_DATA[0].filePath);
  const configPath = INPUT_DATA[0].configPath;

  process.env.DEBUG = 'true';
  await readAndFilterData(dataBuffer, configPath);
  const logsWithDebug = logSpy.mock.calls.length;

  process.env.DEBUG = 'false';
  logSpy.mockClear();
  await readAndFilterData(dataBuffer, configPath);
  const logsWithoutDebug = logSpy.mock.calls.length;
  expect(logsWithDebug - logsWithoutDebug).toBe(1);
});

test('Test if the parser score is plausible', async () => {
  const dataBuffer = fs.readFileSync(
    path.join(__dirname, 'resources/Modulhandbuch PO2018.pdf')
  );
  let result;

  // special config so that every plausibility test passes
  result = await readAndFilterData(
    dataBuffer,
    path.join(__dirname, 'resources/PO2018_plausibilityPass.json')
  );
  expect(result.reduce((acc, curr) => acc + curr.parserScore, 0)).toBe(0);

  // special config so that every plausibility test fails
  result = await readAndFilterData(
    dataBuffer,
    path.join(__dirname, 'resources/PO2018_plausibilityFail.json')
  );
  expect(result.reduce((acc, curr) => acc + curr.parserScore, 0)).toBe(
    -5 * result.length
  );
});

describe('Test invalid user input', () => {
  test('Invalid path to config file - should throw an error', async () => {
    const dataBuffer = fs.readFileSync(INPUT_DATA[0].filePath);
    const configPath = 'invalid/path/to/a/non/existent/config.json';
    await expect(readAndFilterData(dataBuffer, configPath)).rejects.toThrow(
      /Failed to load the configuration from the file with the path.*/
    );
  });

  test('Syntax error in config file - should throw an error', async () => {
    const dataBuffer = fs.readFileSync(INPUT_DATA[0].filePath);
    const configPath = path.join(
      __dirname,
      'resources/invalidInputs/brokenJSON.json'
    );
    await expect(readAndFilterData(dataBuffer, configPath)).rejects.toThrow(
      /Failed to load the configuration from the file with the path.*/
    );
  });

  test('Invalid pdf file - should throw an error', async () => {
    const dataBuffer = fs.readFileSync(
      path.join(__dirname, 'resources/invalidInputs/notActuallyAPdf.pdf')
    );
    const configPath = INPUT_DATA[0].configPath;
    await expect(readAndFilterData(dataBuffer, configPath)).rejects.toThrow(
      /Failed to read the PDF file.*/
    );
  });

  test('Pdf file without any module information - should return an object with no data', async () => {
    const dataBuffer = fs.readFileSync(
      path.join(__dirname, 'resources/invalidInputs/noModuleInformation.pdf')
    );
    const configPath = INPUT_DATA[0].configPath;
    const result = await readAndFilterData(dataBuffer, configPath);
    expect(result).toStrictEqual([
      {
        moduleApplicability: '',
        moduleCredits: '',
        moduleID: '',
        moduleLanguage: '',
        moduleName: '',
        parserScore: -5
      }
    ]);
  });

  test('Pdf file without any text - should throw an error', async () => {
    const dataBuffer = fs.readFileSync(
      path.join(__dirname, 'resources/invalidInputs/pdfWithoutText.pdf')
    );
    await expect(readAndFilterData(dataBuffer)).rejects.toThrow(
      /No modules found.*/
    );
  });

  test('No config file when raw data is requested - should throw an error', async () => {
    const dataBuffer = fs.readFileSync(INPUT_DATA[0].filePath);
    await expect(
      readAndFilterData(dataBuffer, undefined, true)
    ).rejects.toThrow(/Please specify a configuration file to use.*/);
  });
});
