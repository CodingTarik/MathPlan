// uploadHandler.js
// const { readAndFilterData } = require('../utils/moduleDescriptionParser.js');
const multer = require('multer');

const readAndFilterData = require('../utils/moduleDescriptionParser.js');
// Spezifiziere den Speicherort und den Dateinamen
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadPDF = (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('Error while uploading files:'); console.error(err);
      res.status(500).send('Error while uploading files');
    } else {
      console.log('Controller wurde angesteuert');
      const uploadPDF = req.files;
      // console.log(uploadPDF);
      // console.log('Buffer: ' + uploadPDF[0].buffer)
      // handleUpload(req, res);
      readAndFilterData(uploadPDF, 'Modulbeschreibung')
        .then((modules) => {
          console.log(modules);
          res.send(modules);
          // alert(modules);
        }).catch((error) => { console.error('Error while parsing the pdf file:'); console.error(error); process.exit(2); });
    }
  });
  // Hier kannst du die hochgeladenen Dateien weiter verarbeiten

  res.send('Dateien erfolgreich hochgeladen');
};

module.exports = { uploadPDF };
