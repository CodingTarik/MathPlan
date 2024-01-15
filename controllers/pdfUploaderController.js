// uploadHandler.js
const { readAndFilterData } = require('../utils/moduleDescriptionParser.js');
const multer = require('multer');
// const pdf = require('../utils/moduleDescriptionParser');//'../utils/modulDescriptionParser.js');
// Spezifiziere den Speicherort und den Dateinamen
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadPDF = (req, res) => {
  // `req.files` enthält die hochgeladenen Dateien im Arbeitsspeicher
  alert(upload);
  alert(req.files);
  const uploadPDF = req.files;

  // Hier kannst du die hochgeladenen Dateien weiter verarbeiten
  readAndFilterData(uploadPDF, 'Modulbeschreibung')
    .then((modules) => {
      res.send(modules);
      alert(modules);
    }).catch((error) => { console.error('Error while parsing the pdf file:'); console.error(error); process.exit(2); });

  res.send('Dateien erfolgreich hochgeladen');
};

module.exports = { uploadPDF };
