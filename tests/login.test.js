const app = require('../app').app;
const request = require('supertest');

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

// FILEPATH: /c:/Users/Maze/Downloads/materno/tests/login.test.js
// Testfall: Überprüfe, ob der Login-Route funktioniert
test('Login-Route funktioniert', async () => {
  const response = await request(app).get('/login');

  // Überprüfe, ob der Statuscode 302 (Redirect) ist
  expect(response.statusCode).toBe(302);
});

// Testfall: Überprüfe, ob der Logout-Route funktioniert
test('Logout-Route funktioniert', async () => {
  const response = await request(app).get('/logout');

  // Überprüfe, ob der Statuscode 302 (Redirect) ist
  expect(response.statusCode).toBe(302);
});

// Testfall: Überprüfe, ob der Testlogin-Route funktioniert
test('Testlogin-Route funktioniert', async () => {
  const response = await request(app).get('/testlogin');

  // Überprüfe, ob der Statuscode 200 ist
  expect(response.statusCode).toBe(200);
});
