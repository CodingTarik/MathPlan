/* eslint security/detect-object-injection: "off" */

const path = require('path');
const fs = require('fs');
const readAndFilterData = require(
  path.join(__dirname, '../utils/moduleDescriptionParser.js')
);

async function prepareData() {
  const dataBuffer = fs.readFileSync(
    path.join(
      __dirname,
      'resources/ModulhandbuchPO2018_neu_und_schn_Stand_15_Dez_21.pdf'
    )
  );
  return await readAndFilterData(dataBuffer, 'Modulbeschreibung');
}

let modules;
beforeAll(async () => {
  modules = await prepareData();
});

test('das Modulhandbuch default enthält 226 Module', async () => {
  expect(modules.length).toBe(226);
});

test('ist die Modulstruktur korrekt aufgebaut', async () => {
  for (let i = 0; i < modules.length; i++) {
    expect(modules[i]).toHaveProperty('moduleID');
    expect(modules[i]).toHaveProperty('moduleName');
    expect(modules[i]).toHaveProperty('moduleCredits');
    expect(modules[i]).toHaveProperty('moduleLanguage');
    expect(modules[i]).toHaveProperty('moduleApplicability');

    for (const property in modules[i]) {
      expect(typeof modules[i][property]).toBe('string');
    }
  }
});

test('Format von der Modulnummer korrekt', async () => {
  for (let i = 0; i < modules.length; i++) {
    expect(modules[i].moduleID).toMatch(/\d\d-\d\d-\d\d\d\d(\/(de|en))?/);
  }
});

test('Format von der Creditpoints ist korrekt', async () => {
  for (let i = 0; i < modules.length; i++) {
    expect(modules[i].moduleCredits).toMatch(/\d{1,2} CP/);
  }
});

test('Format von der Sprache ist korrekt', async () => {
  for (let i = 0; i < modules.length; i++) {
    expect(modules[i].moduleLanguage).toMatch(/(Englisch.*|Deutsch.*)/i);
  }
});
