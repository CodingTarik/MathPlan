const request = require('supertest');
const app = require('../app').app;
const db = require('../database/database');
const dbhelper = require('../database/examRegulationHelper');

describe('ExamRegulation API Tests', () => {
  // Setup
  beforeAll(async () => {
    await db.sequelize.sync();
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
    expect(examReg.name).toEqual(newExamRegulationRequest.internalName);
    expect(
      (await dbhelper.getExamRegulation(newExamRegulationRequest.internalName))
        .jsonSchema
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

describe('POST /api/intern/deleteExamRegulationByName', () => {
  beforeAll(async () => {
    db.config.dialect = 'sqlite';
    db.config.storage = 'database.test.sqlite';
    db.sequelize.sync();
    // wait 3 sec
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  test('It should delete an exam regulation and respond with status code 200', async () => {
    // first add a new exam regulation
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
    await request(app)
      .post('/api/intern/addExamRegulation')
      .send(newExamRegulationRequest);
    // wait 2 sec
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // check if exam regulation exists
    expect(
      await dbhelper.isExamRegulationExists(
        newExamRegulationRequest.internalName
      )
    ).toBe(true);
    // delete exam regulation
    const response = await request(app)
      .post('/api/intern/deleteExamRegulationByName')
      .send({ name: newExamRegulationRequest.internalName });
    expect(response.statusCode).toBe(200);
    // wait 2 sec
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // check if exam regulation exists
    expect(
      await dbhelper.isExamRegulationExists(
        newExamRegulationRequest.internalName
      )
    ).toBe(false);
  });

  test('It should respond with a 400 status if some fields are not provided', async () => {
    // add some random exam regulation
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
    await request(app)
      .post('/api/intern/addExamRegulation')
      .send(newExamRegulationRequest);
    // wait 2 sec
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // check if exam regulation exists
    expect(
      await dbhelper.isExamRegulationExists(
        newExamRegulationRequest.internalName
      )
    ).toBe(true);
    let response = await request(app)
      .post('/api/intern/deleteExamRegulationByName')
      .send(null);
    expect(response.statusCode).toBe(400);

    // now with random name
    response = await request(app)
      .post('/api/intern/deleteExamRegulationByName')
      .send({ name: Math.floor(Math.random() * 10000000).toString() });
    expect(response.statusCode).toBe(400);

    response = await request(app)
      .post('/api/intern/deleteExamRegulationByName')
      .send({ name: null });
    expect(response.statusCode).toBe(400);

    // check if exam regulation still exists
    expect(
      await dbhelper.isExamRegulationExists(
        newExamRegulationRequest.internalName
      )
    ).toBe(true);
  });
});
