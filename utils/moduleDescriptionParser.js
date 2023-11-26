const fs = require("fs");
const pdf = require("pdf-parse");

//TODO: Diese Infos ggf. aus Konfigurationsdatei einlesen?

// properties to be extracted from the module description
// propertyName: name of the property in the resulting object
// property can be found in the module description between readFrom and readTo (both exclusive)
// if excess is given, the specified characters will be removed from the property value after extraction
const moduleProperties = [
  {
    propertyName: "moduleID",
    readFrom: "Modul Nr.",
    readTo: "Creditpoints",
    excess: ["\\s"],
  },
  {
    propertyName: "moduleName",
    readFrom: "Modulname",
    readTo: "Modul",
  },
  {
    propertyName: "moduleCredits",
    readFrom: "Modul Nr.",
    readTo: "Arbeitsaufwand",
    excess: ["^.*Creditpoints\\s"],
  },
  {
    propertyName: "moduleLanguage",
    readFrom: "(Semester|Verwendbarkeit|Unregelmäßig) Sprache",
    readTo: "Modulverantwortliche",
  },
  {
    propertyName: "moduleApplicability",
    readFrom: "Verwendbarkeit des Moduls",
    readTo: "9 Literatur",
  },
];

//TODO: diese Funktion könnte/sollte man ggf. aufspalten, da sie sehr lang ist
async function readAndFilterData(dataBuffer, searchTerm) {
  try {
    // read content from pdf file
    const data = await pdf(dataBuffer);

    // extract text from pdf and do some preprocessing
    const pdfText = moduleDescriptionsPreprocessing(data.text);

    //TODO: searchTerm wieder entfernen? Sehe den Sinn nicht so ganz...
    // filter text for searchTerm
    if (!pdfText.includes(searchTerm)) {
      throw new Error(`Search term ${searchTerm} not found in data buffer!`);
    }

    // count number of modules
    const numberOfModules = (pdfText.match(/Modulbeschreibung/g) || []).length;
    if (numberOfModules === 0) {
      throw new Error("No modules found in data buffer!");
    }

    // collect all module properties into one array per property
    const parsedProperties = {};
    for (const property of moduleProperties) {
      parsedProperties[property.propertyName] = filterAndAppendNextWords(
        pdfText,
        property.readFrom,
        property.readTo
      );

      if (parsedProperties[property.propertyName].length !== numberOfModules) {
        throw new Error(
          `Number of parsed ${property.propertyName} (${parsedProperties[property.propertyName].length}) does not match number of modules (${numberOfModules})!`
        );
      }
    }

    // build target objects
    const modules = [];
    for (let i = 0; i < numberOfModules; i++) {
      const module = {};
      for (const property of moduleProperties) {
        let parsedProperty = parsedProperties[property.propertyName][i];

        // if needed, remove excess characters from property value
        if (property.excess) {
          for (const excess of property.excess) {
            parsedProperty = parsedProperty.replace(new RegExp(excess), "");
          }
        }

        module[property.propertyName] = parsedProperty;
      }
      modules.push(module);
    }

    return modules;

  } catch (error) {
    console.error("Error while parsing the pdf file:", error);
  }
}

function moduleDescriptionsPreprocessing(moduleDescriptions) {
  moduleDescriptions = moduleDescriptions
    .replace(/(\r\n|\n|\r)/gm, " ")                   // remove line breaks
    .replace(/\s+/g, " ")                             // harmonize spaces
    .replace(/Arbeits\ aufwand/g, "Arbeitsaufwand");  // fix additional line break in Arbeitsaufwand

  return moduleDescriptions;

}

function filterAndAppendNextWords(originalString, readFrom, readTo) {
  // Escape special characters in search terms
  readFrom = toRegexString(readFrom);
  readTo = toRegexString(readTo);

  // Find all matches of readFrom ... readTo
  const regex = new RegExp(`${readFrom}.*?${readTo}`, "gm");
  const matches = originalString.match(regex);

  if (matches === null) {
    return [];
  }

  // Remove searchTerm and keyWordBis from matches
  for (let i = 0; i < matches.length; i++) {
    matches[i] = matches[i].replace(new RegExp(`^${readFrom}`), "");
    matches[i] = matches[i].replace(new RegExp(`${readTo}$`), "");
    matches[i] = matches[i].trim();
  }

  return matches;
}

// Helper function to escape special characters in a string
function toRegexString(str) {
  return str.replace(/\ /g, "\\ ").replace(/\./g, "\\.");
}


function debug() {
  const filename = process.argv.length > 2 ? process.argv[2] : "./ModulhandbuchPO2018_neu_und_schn_Stand_15_Dez_21.pdf";

  const searchTerm = "Modulbeschreibung";
  const dataBuffer = fs.readFileSync(filename);
  readAndFilterData(dataBuffer, searchTerm).then((modules) => { console.dir(modules, {maxArrayLength: null}); } );
}

debug();