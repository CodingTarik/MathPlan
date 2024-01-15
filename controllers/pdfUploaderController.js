// uploadHandler.js

const multer = require('multer');
//const pdf = require('../utils/moduleDescriptionParser');/*'../utils/modulDescriptionParser.js');*/
// Spezifiziere den Speicherort und den Dateinamen
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handleFileUpload = (req, res) => {
  // `req.files` enthält die hochgeladenen Dateien im Arbeitsspeicher
  const uploadedFiles = req.files;
    
  // Hier kannst du die hochgeladenen Dateien weiter verarbeiten
  searchTerm = 'Modulbeschreibung';
  readAndFilterData(uploadedFiles, searchTerm).then((modules) => {  
    res.send(modules);

}).catch((error) => { console.error('Error while parsing the pdf file:'); console.error(error); process.exit(2); });
  
res.send('Dateien erfolgreich hochgeladen');
};

module.exports = { handleFileUpload };
