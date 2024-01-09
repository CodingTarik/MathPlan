const request = require('supertest');
const app = require('../app').app;
const db = require('../database/database');
const dbhelper = require('../database/examRegulationHelper');

describe('POST /api/intern/addExamRegulation', () => {
  beforeAll(async () => {
    db.config.dialect = 'sqlite';
    db.config.storage = 'database.test.sqlite';
    db.sequelize.sync();
    // wait 3 sec
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });
  test('It should add a new exam regulation and respond with status code 200', async () => {
    // module with random id
    const newExamRegulation = {
      area: {
        name: 'Hab',
        description: '42',
        module: [
          {
            name: {
              moduleID: '1100101 1100100 1101000 1100111',
              moduleName: 'dgh',
              moduleCredits: 5,
              moduleLanguage: 'dghf',
              moduleApplicability: 'dfh'
            },
            moduleID: '',
            creditPoints: 0,
            pflicht: false,
            nichtwählbarmitmodul: []
          }
        ]
      }
    };
    // generate random name
    const newExamRegulationRequest = {
      internalName: Math.floor(Math.random() * 10000000).toString(),
      examRegulation: newExamRegulation
    };
    const response = await request(app)
      .post('/api/intern/addExamRegulation')
      .send(newExamRegulationRequest);

    expect(response.statusCode).toBe(200);
    // Check if the exam regulation was added to the database, wait 2 sec
    await new Promise((resolve) => setTimeout(resolve, 3000));
    expect(
      await dbhelper.isExamRegulationExists(
        newExamRegulationRequest.internalName
      )
    ).toBe(true);
    const examReg = await dbhelper.getExamRegulation(
      newExamRegulationRequest.internalName
    );
    expect(
      examReg.name
    ).toEqual(newExamRegulationRequest.internalName);
    expect(
      (await dbhelper.getExamRegulation(newExamRegulationRequest.internalName)).jsonSchema
    ).toEqual(JSON.stringify(newExamRegulation));
  });
  test('not existance exam regulation name', async () => {
    expect(
      await dbhelper.isExamRegulationExists(
        'THIS IS A RANDOM NAME THAT SHOULD NOT EXIST'
      )
    ).toBe(false);
  });
  test('It should respond with a 400 status if some fields are not provided', async () => {
    let response = await request(app)
      .post('/api/intern/addExamRegulation')
      .send(null);
    expect(response.statusCode).toBe(400);

    let newExamRegulationRequestTest = {
      internalName: Math.floor(Math.random() * 10000000).toString()
    };

    response = await request(app)
      .post('/api/intern/addExamRegulation')
      .send(newExamRegulationRequestTest);
    expect(response.statusCode).toBe(400);

    newExamRegulationRequestTest = {
      examRegulation: {}
    };
    response = await request(app)
      .post('/api/intern/addExamRegulation')
      .send(newExamRegulationRequestTest);
    expect(response.statusCode).toBe(400);
  });
});
