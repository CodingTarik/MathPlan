const fs = require('fs').promises;
const path = require('path');

/**
 * Module Controller function to handle the API request for retrieving modules.
 *
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise representing the completion of the function.
 */
const getAllModules = async (req, res) => {
  try {
    // Construct the file path for the modules JSON file
    const filePath = path.join(__dirname, '../tests/static/modules.json');

    // Read the contents of the file asynchronously
    const data = await fs.readFile(filePath);

    // Parse the JSON data
    const modules = JSON.parse(data);

    // Send the modules as a JSON response
    res.json(modules);
  } catch (error) {
    // Handle errors by logging and sending a 500 Internal Server Error response
    console.error('Error reading modules:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllModules = getAllModules;
