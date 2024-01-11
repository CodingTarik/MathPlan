const request = require('supertest');
const app = require('../app').app;
const db = require('../database/database');
//const { describe } = require('node:test');

describe('POST /api/intern/addModul', () => {
  beforeAll(async () => {
    db.config.dialect = 'sqlite';
    db.config.storage = 'database.test.sqlite';
    db.sequelize.sync();
    // wait 3 sec
    await new Promise(resolve => setTimeout(resolve, 3000));
  });
  test('It should add a new module and respond with status code 200', async () => {
    // module with random id
    const newModule = {
      id: Math.floor(Math.random() * 10000000).toString(),
      name: 'Test Module',
      credits: 3,
      language: 'English',
      applicability: 'Computer Science'
    };

    const response = await request(app)
      .post('/api/intern/addModul')
      .send(newModule);

    expect(response.statusCode).toBe(200);
    // Check if the module was added to the database, wait 3 sec
    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(await db.isModuleExists(newModule.id)).toBe(true);
    expect(await db.isModuleExists('ISJDSJGDJGSDIJOGSIKGD')).toBe(false);
    expect(await db.getAllModules()).toContainEqual(
      expect.objectContaining({
        moduleID: newModule.id,
        moduleName: newModule.name,
        moduleCredits: newModule.credits,
        moduleLanguage: newModule.language,
        moduleApplicability: newModule.applicability
      })
    );
  });

  test('It should respond with a 400 status if data is not provided', async () => {
    const response = await request(app).post('/api/intern/addModul');
    expect(response.statusCode).toBe(400);
  });
});
/* 
describe('GET /api/intern/getModules/:id/:name/:credits/:language/:applicability', () => {
  beforeAll(async () => {
    db.config.dialect = 'sqlite';
    db.config.storage = 'database.test.sqlite';
    db.sequelize.sync();
    // wait 3 sec
    await new Promise(resolve => setTimeout(resolve, 3000));
  });
  test('It should return the one matching module', async () => {
    const newModule = {
      id: '1FA',
      name: 'Numerik',
      credits: 5,
      language: 'English',
      applicability: 'B.Sc. Mathematik'
    };
    db.addModul(newModule.id, newModule.name, newModule.credits, newModule.language, newModule.applicability);
    const response = await request(app)
      .get(`/api/intern/getModules/${newModule.id}/${newModule.name}/${newModule.credits}/${newModule.language}/${newModule.applicability}`);
    expect(response.statusCode).toBe(200);
    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(response.body[0].moduleID).toBe('1FA');
  })

});
 */