const app = require('../app').app;
const request = require('supertest');

test('Server is accessable', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
});

test('Server returns an error', async () => {
  const response = await request(app).get('/fdgdgfdgdfgdfgdfgdfgdfgfd');
  expect(response.statusCode).toBe(404);
});

test('Login-route is found', async () => {
  const response = await request(app).get('/login');
  expect(response.statusCode).toBe(302);
});

test('Logout-route is found', async () => {
  const response = await request(app).get('/logout');
  expect(response.statusCode).toBe(302);
});
