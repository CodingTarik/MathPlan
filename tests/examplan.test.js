const request = require('supertest');
const app = require('../app').app;
const db = require('../database/database');
const dbhelper = require('../database/examPlanHelper');

describe('ExamPlan API Tests', () => {
  // Setup
  beforeAll(async () => {
    await db.sequelize.sync();
    // wait 3 sec
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  test('It should add a new exam plan and respond with status code 200 and delete is afterwards', async () => {
    // module with random id
    const newExamPlan = {
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
    const newExamPlanRequest = {
      name: Math.floor(Math.random() * 10000000).toString(),
      examPlanString: JSON.stringify(newExamPlan),
      typeOfPlan: "Prüfungsplan"
    };
    const response = await request(app)
      .post('/api/intern/addExamPlan')
      .send(newExamPlanRequest);

    expect(response.statusCode).toBe(200);
    console.log(response)
    // Check if the exam regulation was added to the database, wait 2 sec
    await new Promise((resolve) => setTimeout(resolve, 3000));
    expect(
      await dbhelper.isExamPlanExists(
        JSON.parse(response.text).id
      )
    ).toBe(true);
    const examPlan = await dbhelper.getExamPlan(
        JSON.parse(response.text).id
    );
    expect(examPlan.name).toEqual(newExamPlanRequest.name);
    expect(examPlan.jsonSchema
    ).toEqual(JSON.stringify(newExamPlan)); 
    await dbhelper.deleteExamPlan(JSON.parse(response.text).id)
    expect(
        await dbhelper.isExamPlanExists(
          JSON.parse(response.text).id
        )
      ).toBe(false);
  });
  test('not exists a id of a exam regulation', async () => {
    expect(
      await dbhelper.isExamPlanExists(
        Math.floor(Math.random() * 10000000)
      )
    ).toBe(false);
  });
  
  test('It should respond with a 400 status if some fields are not provided', async () => {
    let response = await request(app)
      .post('/api/intern/addExamPlan')
      .send(null);
    expect(response.statusCode).toBe(400);

    let newExamPlanRequestTest = {
      name: Math.floor(Math.random() * 10000000).toString()
    };

    response = await request(app)
      .post('/api/intern/addExamPlan')
      .send(newExamPlanRequestTest);
    expect(response.statusCode).toBe(400);

    newExamPlanRequestTest = {
      examPlanString: {}
    };
    response = await request(app)
      .post('/api/intern/addExamPlan')
      .send(newExamPlanRequestTest);
    expect(response.statusCode).toBe(400);
  }); 

  test('It should respond with false if exam plan to be deleted does not exist', async () => {
    const response = await dbhelper.deleteExamPlan(Math.floor(Math.random() * 10000000));
    expect(response).toBe(false)
  }); 
});
