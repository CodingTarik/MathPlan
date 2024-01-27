const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../app').app;

test('test the upload with an null element', async () => {
  const response = await request(app)
    .post('/api/intern/uploadPDFtoServer')
    .send(null);

  expect(response.statusCode).toBe(500);
});

test('test the upload with an empty element', async () => {
  const response = await request(app)
    .post('/api/intern/uploadPDFtoServer')
    .send('');

  expect(response.statusCode).toBe(500);
});

test('test the upload with an array with one null argment', async () => {
  const response = await request(app)
    .post('/api/intern/uploadPDFtoServer')
    .send([null]);

  expect(response.statusCode).toBe(500);
});

test('test the upload with an array with one valid argment', async () => {
  const dataBuffer = fs.readFileSync(path.join(__dirname, 'resources/ModulhandbuchPO2018_neu_und_schn_Stand_15_Dez_21.pdf'));
  const formData = new FormData();
  formData.append('file', dataBuffer);
  const response = await request(app)
    .post('/api/intern/uploadPDFtoServer')
    .attach('file', dataBuffer, 'ModulhandbuchPO2018_neu_und_schn_Stand_15_Dez_21.pdf');
  expect(response.statusCode).toBe(200);
  expect(response.body[0].length).toBe(226);
});

test('test the upload with an array with one invvalid argment', async () => {
  const dataBuffer = fs.readFileSync(path.join(__dirname, 'resources/Pruefungsplan_BSc_PO_2018_MSc_PO_2018_2019-07-04.pdf'));
  const formData = new FormData();
  formData.append('file', dataBuffer);
  const response = await request(app)
    .post('/api/intern/uploadPDFtoServer')
    .attach('file', dataBuffer, 'Pruefungsplan_BSc_PO_2018_MSc_PO_2018_2019-07-04.pdf');
  expect(response.statusCode).toBe(500);
});
