const multer = require('multer'); // for parsing multipart/form-data
const readAndFilterData = require('../utils/moduleDescriptionParser.js'); // for parsing pdf files

// specify the storage type and the path
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Uploads a pdf file to the server and parses it.
 *
 * @param req The request.
 * @param res The response.
 */
const uploadPDF = (req, res) => {
  upload.array('file')(req, res, async (err) => {
    // upload multiple files in an array
    if (err) {
      throw new Error('Error while uploading files:', err);
    } else {
      const listOfFailedFiles = []; // list of failed files
      try {
        const listOfUploadedModuleHandBooks = []; // list of uploaded module handbooks
        // map each file to a promise that resolves to the modules
        const promises = req.files.map(async (file) => {
          console.log('Name of the uploaded PDF-File: ' + file.originalname); // log the original name of each file
          try {
            const modules = await readAndFilterData(file.buffer);
            listOfUploadedModuleHandBooks.push(modules);
          } catch (error) {
            listOfFailedFiles.push(file.originalname);
          }
        });

        // wait until all promises are resolved
        await Promise.all(promises);

        res.send([listOfUploadedModuleHandBooks, listOfFailedFiles]);
      } catch (err) {
        res.status(500).send('Error while uploading files:' + err);
      }
    }
  });
};

module.exports = { uploadPDF };
