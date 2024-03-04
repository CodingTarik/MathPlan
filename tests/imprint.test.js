// Import necessary modules for testing
const request = require('supertest'); // Library for testing HTTP assertions
const cheerio = require('cheerio'); // Library for parsing HTML and manipulating the DOM
const app = require('../app').app; // Import the Express application
const config = require('../config'); // Import configuration settings

// Describe block for the Imprint URL Test
describe('Imprint URL Test', () => {
  // Test case: Check if the imprint URL has the correct href attribute
  test('should have correct href attribute for imprint URL', async () => {
    // Send a GET request to the root endpoint ('/') to load the homepage
    const response = await request(app).get('/').expect(200);

    // Use Cheerio to parse and analyze the HTML in the response
    const $ = cheerio.load(response.text);

    // Find the link with the ID "imprinturl"
    const imprintLink = $('#imprinturl');

    // Extract the href attribute value from the link
    const hrefAttribute = imprintLink.attr('href');

    // Expect the href value to match the one defined in the configuration
    expect(hrefAttribute).toBe(config.data.imprinturl);

    // Additional check: Ensure that the href value is not a specific invalid URL
    expect(hrefAttribute).not.toBe(
      'https://example.comdjsghdsjghdjshgjdshgjdshgjdshgjdsg'
    );
  });
});
