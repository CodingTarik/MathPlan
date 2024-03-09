/* eslint security/detect-object-injection: "off" */

const request = require('supertest');
const app = require('../app').app;
const db = require('../database/database');
const modulehelper = require('../database/modulHelper');

describe('Modules API Tests', () => {
  // Setup
  beforeAll(async () => {
    await db.sequelize.sync();
    // wait 3 sec
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('Database ready');
  });

  // Test 1
  test('POST /api/intern/addModul: It should add a new module and respond with status code 200', async () => {
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(await modulehelper.isModuleExists(newModule.id)).toBe(true);
    expect(await modulehelper.isModuleExists('ISJDSJGDJGSDIJOGSIKGD')).toBe(
      false
    );
    expect(await modulehelper.getAllModuls()).toContainEqual(
      expect.objectContaining({
        moduleID: newModule.id,
        moduleName: newModule.name,
        moduleCredits: newModule.credits,
        moduleLanguage: newModule.language,
        moduleApplicability: newModule.applicability
      })
    );
    modulehelper.deleteModulById(newModule.id);
  });

  // Test 2
  test('POST /api/intern/addModul: It should respond with a 400 status if data is not provided', async () => {
    const response = await request(app).post('/api/intern/addModul');
    expect(response.statusCode).toBe(400);
  });

  // Test 3
  test('GET /api/intern/getAllModulsMin: It should return all modules with minimal information parsed for json editor', async () => {
    const newModule = {
      moduleID: Math.floor(Math.random() * 10000000).toString(),
      moduleName: 'Numerik',
      moduleCredits: 5,
      moduleLanguage: 'English',
      moduleApplicability: 'B.Sc. Mathematik'
    };
    await modulehelper.addModul(
      newModule.moduleID,
      newModule.moduleName,
      newModule.moduleCredits,
      newModule.moduleLanguage,
      newModule.moduleApplicability
    );
    const response = await request(app).get('/api/intern/getAllModulsMin');
    expect(response.statusCode).toBe(200);
    let containsNewModule = false;
    const item = response.body;
    for (const key in response.body) {
      if (
        typeof item[key] === 'object' &&
        item[key].moduleID === newModule.moduleID
      ) {
        containsNewModule = true;
        break;
      }
    }
    expect(containsNewModule).toBe(true);
    modulehelper.deleteModulById(newModule.moduleID);
  });

  // Test 4
  test('GET /api/intern/getModules/:id/:name/:credits/:language/:applicability: It should return the one matching module', async () => {
    const newModule = {
      moduleID: Math.floor(Math.random() * 10000000).toString(),
      moduleName: 'Numerik',
      moduleCredits: 5,
      moduleLanguage: 'English',
      moduleApplicability: 'B.Sc. Mathematik'
    };
    await modulehelper.addModul(
      newModule.moduleID,
      newModule.moduleName,
      newModule.moduleCredits,
      newModule.moduleLanguage,
      newModule.moduleApplicability
    );
    let response = await request(app).get(
      `/api/intern/getModules/${newModule.moduleID}/${newModule.moduleName}/${newModule.moduleCredits}/${newModule.moduleLanguage}/${newModule.moduleApplicability}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body).toContainEqual(expect.objectContaining(newModule));
    response = await request(app).get(
      `/api/intern/getModules/${newModule.moduleID}/${'undefined'}/${'undefined'}/${'undefined'}/${'undefined'}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body).toContainEqual(expect.objectContaining(newModule));
    modulehelper.deleteModulById(newModule.moduleID);
  });

  // Test 5
  test('GET /api/intern/getModules/:id/:name/:credits/:language/:applicability: It should respond with a 400 status if more than 50 modules match the request', async () => {
    const newModules = new Array(51);
    for (let i = 0; i < 51; i++) {
      const newModule = {
        moduleID: Math.floor(Math.random() * 10000000).toString(),
        moduleName: 'Numerik',
        moduleCredits: 5,
        moduleLanguage: 'English',
        moduleApplicability: 'B.Sc. Mathematik'
      };
      newModules[parseInt(i)] = newModule;
      await modulehelper.addModul(
        newModule.moduleID,
        newModule.moduleName,
        newModule.moduleCredits,
        newModule.moduleLanguage,
        newModule.moduleApplicability
      );
    }
    const response = await request(app).get(
      `/api/intern/getModules/${'undefined'}/${newModules[0].moduleName}/${newModules[0].moduleCredits}/${newModules[0].moduleLanguage}/${newModules[0].moduleApplicability}`
    );
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(
      'The search request yielded more than 50 requests'
    );
    for (let i = 0; i < 51; i++) {
      modulehelper.deleteModulById(newModules[parseInt(i)].moduleID);
    }
  });

  // Test 6
  test('GET /api/intern/getModules/:id/:name/:credits/:language/:applicability: It should respond with an empty array if no module matches the get request', async () => {
    const newModule = {
      moduleID: Math.floor(Math.random() * 10000000).toString(),
      moduleName: 'Numerik',
      moduleCredits: 5,
      moduleLanguage: 'English',
      moduleApplicability: 'B.Sc. Mathematik'
    };
    const response = await request(app).get(
      `/api/intern/getModules/${newModule.moduleID}/${newModule.moduleName}/${newModule.moduleCredits}/${newModule.moduleLanguage}/${newModule.moduleApplicability}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  // Test 7
  test('GET /api/intern/getModules/:id/:name/:credits/:language/:applicability: It should return all modules that contain the moduleID and moduleName (does not have to match exactly)', async () => {
    const newModule1 = {
      moduleID: Math.floor(Math.random() * 10000000).toString(),
      moduleName: 'Numerik',
      moduleCredits: 5,
      moduleLanguage: 'English',
      moduleApplicability: 'B.Sc. Mathematik'
    };
    const newModule2 = {
      moduleID: newModule1.moduleID + 'A',
      moduleName: 'Numerik Seminar',
      moduleCredits: 5,
      moduleLanguage: 'English',
      moduleApplicability: 'B.Sc. Mathematik'
    };
    const newModule3 = {
      moduleID: newModule1.moduleID + 'B',
      moduleName: 'Numerik',
      moduleCredits: 5,
      moduleLanguage: 'English, Deutsch',
      moduleApplicability: 'B.Sc. Mathematik'
    };
    await modulehelper.addModul(
      newModule1.moduleID,
      newModule1.moduleName,
      newModule1.moduleCredits,
      newModule1.moduleLanguage,
      newModule1.moduleApplicability
    );
    await modulehelper.addModul(
      newModule2.moduleID,
      newModule2.moduleName,
      newModule2.moduleCredits,
      newModule2.moduleLanguage,
      newModule2.moduleApplicability
    );
    await modulehelper.addModul(
      newModule3.moduleID,
      newModule3.moduleName,
      newModule3.moduleCredits,
      newModule3.moduleLanguage,
      newModule3.moduleApplicability
    );
    const response = await request(app).get(
      `/api/intern/getModules/${newModule1.moduleID}/${newModule1.moduleName}/${newModule1.moduleCredits}/${newModule1.moduleLanguage}/${newModule1.moduleApplicability}`
    );
    expect(response.statusCode).toBe(200);
    // should not be 3 since moduleLanguage has to match exactly
    expect(response.body.length).toBe(2);
    // should be ordered by moduleID
    expect(response.body[0].moduleID).toBe(newModule1.moduleID);
    expect(response.body[1].moduleID).toBe(newModule2.moduleID);
    expect(response.body).toContainEqual(expect.objectContaining(newModule1));
    expect(response.body).toContainEqual(expect.objectContaining(newModule2));
    modulehelper.deleteModulById(newModule1.moduleID);
    modulehelper.deleteModulById(newModule2.moduleID);
    modulehelper.deleteModulById(newModule3.moduleID);
  });

  // Test 8
  test('GET /api/intern/getOneModule/:id: It should return an existing module and respond with status code 200', async () => {
    // add module with random id
    const id = Math.floor(Math.random() * 10000000).toString();
    const newModule = {
      id,
      name: 'Test Module',
      credits: 5,
      language: 'English',
      applicability: 'Computer Science'
    };

    await modulehelper.addModul(
      newModule.id,
      newModule.name,
      newModule.credits,
      newModule.language,
      newModule.applicability
    );
    expect(await modulehelper.isModuleExists(newModule.id)).toBe(true);

    const response = await request(app).get(`/api/intern/getOneModule/${id}`);
    const returnedModule = JSON.parse(response.text);
    expect(response.statusCode).toBe(200);
    expect(returnedModule.moduleID).toBe(newModule.id);
    expect(returnedModule.moduleCredits).toBe(newModule.credits);
    expect(returnedModule.moduleName).toBe(newModule.name);
    expect(returnedModule.moduleApplicability).toBe(newModule.applicability);
    expect(returnedModule.moduleLanguage).toBe(newModule.language);
    modulehelper.deleteModulById(newModule.id);
  });

  // Test 9
  test('PUT /api/intern/updateModule/:id: It should modify an existing module and respond with status code 200', async () => {
    // add module with random id
    const id = Math.floor(Math.random() * 10000000).toString();
    const newModule = {
      id,
      name: 'Test Module',
      credits: 4,
      language: 'English',
      applicability: 'Computer Science'
    };

    await modulehelper.addModul(
      newModule.id,
      newModule.name,
      newModule.credits,
      newModule.language,
      newModule.applicability
    );
    expect(await modulehelper.getAllModuls()).toContainEqual(
      expect.objectContaining({
        moduleID: newModule.id,
        moduleName: newModule.name,
        moduleCredits: newModule.credits,
        moduleLanguage: newModule.language,
        moduleApplicability: newModule.applicability
      })
    );

    // modify module
    const modifiedModule = {
      id,
      name: 'modified Test Module',
      credits: 7,
      language: 'English',
      applicability: 'Computer Science'
    };

    const response = await request(app)
      .put(`/api/intern/updateModule/${id}`)
      .send(modifiedModule);

    expect(response.statusCode).toBe(200);
    // Check if the module was modified in the database, wait 2 sec (just to be sure on slow computers)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(await modulehelper.isModuleExists(newModule.id)).toBe(true);
    const tmp = await modulehelper.getOneModule(id);
    expect(tmp.moduleID).toBe(modifiedModule.id);
    expect(tmp.moduleCredits).toBe(modifiedModule.credits);
    expect(tmp.moduleName).toBe(modifiedModule.name);
    expect(tmp.moduleApplicability).toBe(modifiedModule.applicability);
    expect(tmp.moduleLanguage).toBe(modifiedModule.language);
    // Check if the data of the old module do not longer exist in the database
    expect(await modulehelper.getAllModuls()).not.toContainEqual(
      expect.objectContaining({
        moduleID: newModule.id,
        moduleName: newModule.name,
        moduleCredits: newModule.credits,
        moduleLanguage: newModule.language,
        moduleApplicability: newModule.applicability
      })
    );
    modulehelper.deleteModulById(modifiedModule.id);
  });

  // Test 10
  test('PUT /api/intern/updateModule/:id: It should respond with a 400 status if data is not provided', async () => {
    const id = Math.floor(Math.random() * 10000000).toString();
    const response = await request(app).put(`/api/intern/updateModule/${id}`);
    expect(response.statusCode).toBe(400);
  });
});

// Test 11
test('DELETE /api/intern/deleteModule/:id: It should respond with a 404 status if the module was not found', async () => {
  const moduleId = Math.floor(Math.random() * 10000000).toString();
  const response = await request(app)
    .delete(`/api/intern/deleteModule/${moduleId}`);
  expect(response.statusCode).toBe(404);
});

// Test 12
test('DELETE /api/intern/deleteModule/:id: It should delete an existing module', async () => {
  const newModule = {
    moduleID: Math.floor(Math.random() * 10000000).toString(),
    moduleName: 'Numerik',
    moduleCredits: 5,
    moduleLanguage: 'English',
    moduleApplicability: 'B.Sc. Mathematik'
  };
  await modulehelper.addModul(newModule.moduleID, newModule.moduleName, newModule.moduleCredits, newModule.moduleLanguage, newModule.moduleApplicability);
  const response = await request(app)
    .delete(`/api/intern/deleteModule/${newModule.moduleID}`);
  expect(response.statusCode).toBe(200);
});
