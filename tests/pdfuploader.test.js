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

test('test the upload with an array with one null argument', async () => {
  const response = await request(app)
    .post('/api/intern/uploadPDFtoServer')
    .send([null]);

  expect(response.statusCode).toBe(500);
});

test('test the upload with an array with one valid argument', async () => {
  const dataBuffer = fs.readFileSync(path.join(__dirname, 'resources/Modulhandbuch PO2018.pdf'));
  const formData = new FormData();
  formData.append('file', dataBuffer);
  const response = await request(app)
    .post('/api/intern/uploadPDFtoServer')
    .attach('file', dataBuffer, 'Modulhandbuch PO2018.pdf');
  expect(response.statusCode).toBe(200);
  expect(response.body[0][0].length).toBe(226);
}, 10000);

test('test the upload with an array with one invvalid argument', async () => {
  const dataBuffer = fs.readFileSync(path.join(__dirname, 'resources/Pruefungsplan_BSc_PO_2018_MSc_PO_2018_2019-07-04.pdf'));
  const formData = new FormData();
  formData.append('file', dataBuffer);
  const response = await request(app)
    .post('/api/intern/uploadPDFtoServer')
    .attach('file', dataBuffer, 'Pruefungsplan_BSc_PO_2018_MSc_PO_2018_2019-07-04.pdf');
  expect(response.statusCode).toBe(200);
  expect(response.body[0].length).toBe(0);
  expect(response.body[1].length).toBe(1);
});

test('test the upload with array of two valid arguments', async () => {
  const dataBuffer = fs.readFileSync(path.join(__dirname, 'resources/Modulhandbuch PO2018.pdf'));
  const dataBuffer2 = fs.readFileSync(path.join(__dirname, 'resources/Modulhandbuch PO2018 - Kopie.pdf'));
  const formData = new FormData();
  formData.append('file', dataBuffer);
  formData.append('file', dataBuffer2);
  const response = await request(app)
    .post('/api/intern/uploadPDFtoServer')
    .attach('file', dataBuffer, 'Modulhandbuch PO2018.pdf')
    .attach('file', dataBuffer2, 'resources/Modulhandbuch PO2018 - Kopie.pdf');
  expect(response.statusCode).toBe(200);
  expect(response.body[0][0].length).toBe(226);
  expect(response.body[0][1].length).toBe(226);
}, 10000);
