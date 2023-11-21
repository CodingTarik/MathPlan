const request = require('supertest');
const app = require('../app').app;

// Testfall: Überprüfe, ob der Server erreichbar ist
test('Server ist erreichbar', async () => {
  const response = await request(app).get('/');

  // Überprüfe, ob der Statuscode 200 ist
  expect(response.statusCode).toBe(200);
});

// Testfall: Überprüfe, wie der Server auf Fehler reagiert
test('Server gibt einen Fehler zurück', async () => {
  const response = await request(app).get('/fdgdgfdgdfgdfgdfgdfgdfgfd');
  // Überprüfe, ob der Statuscode 404 ist
  expect(response.statusCode).toBe(404);
});
