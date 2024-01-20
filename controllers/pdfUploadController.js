const multer = require('multer'); // for parsing multipart/form-data
const readAndFilterData = require('../utils/moduleDescriptionParser.js'); // for parsing pdf files

// specify the storage type and the path
const storage = multer.memoryStorage();
const upload = multer({ storage });

const searchTerm = 'Modulbeschreibung'; // the uploaded pdf file must contain this term

// get the uploaded pdf file(s) and parse it and return the result
const uploadPDF = (req, res) => {
  upload.array('file')(req, res, async (err) => { // upload multiple files in an array
    if (err) {
      console.error('Error while uploading files:');
      console.error(err);
      res.status(500).send('Error while uploading files');
    } else {
      try {
        let status = 200; // status code for the response
        const listOfUploadedModuleHandBooks = []; // list of uploaded module handbooks
        // map each file to a promise that resolves to the modules
        const promises = req.files.map(async file => {
          console.log('Name of the uploaded PDF-File: ' + file.originalname); // log the original name of each file

          try {
            const modules = await readAndFilterData(file.buffer, searchTerm);
            listOfUploadedModuleHandBooks.push(modules);
          } catch (error) {
            console.error('Error while parsing the pdf file:');
            console.error(error);
            status = 500;
          }
        });

        // wait until all promises are resolved
        await Promise.all(promises);

        if (status === 500) {
          res.status(status).send('Error while parsing the pdf file');
        } else {
          res.status(status).send(listOfUploadedModuleHandBooks);
        }
      } catch (err) {
        console.error('Error while uploading files:');
        console.error(err);
        res.status(500).send('Error while uploading files');
      }
    };
  });
};

module.exports = { uploadPDF };
