const request = require('supertest');
const app = require('../app').app;
const db = require('../database/database');
const configFile = require('../config.js');
const Sequelize = require('sequelize');

beforeAll(async () => {
  const config /** @type {DatabaseConfig} */ = {
    database: configFile.database.DB_DATABASE,
    username: configFile.database.DB_USER, // Your MySQL username
    password: configFile.database.DB_PASSWORD, // Your MySQL password
    host: configFile.database.DB_HOST,
    dialect: 'sqlite',
    storage: 'database.test.sqlite'
  };
  const sequelize = new Sequelize(config);
  const Modul /** @type {ModulModel} */ = sequelize.define('Modul', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    moduleID: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    moduleName: {
      type: Sequelize.STRING,
      allowNull: true // TODO rückgängig?
    },
    moduleCredits: {
      type: Sequelize.INTEGER,
      allowNull: true // TODO rückgängig?
    },
    moduleLanguage: {
      type: Sequelize.STRING,
      allowNull: true // TODO rückgängig?
    },
    moduleApplicability: {
      type: Sequelize.STRING,
      allowNull: true // TODO rückgängig?
    }
  });
  db.setModul(Modul);
  await sequelize.sync();
});
afterAll(() => {
  if (configFile.database.DB_DIAlECT !== 'sqlite') {
    db.sequelize.close();
  }
});
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
  db.deleteModulById(newModule.id);
});

test('POST /api/intern/addModul: It should respond with a 400 status if data is not provided', async () => {
  const response = await request(app).post('/api/intern/addModul');
  expect(response.statusCode).toBe(400);
});

test('GET /api/intern/getModules/:id/:name/:credits/:language/:applicability: It should return the one matching module', async () => {
  const newModule = {
    moduleID: Math.floor(Math.random() * 10000000).toString(),
    moduleName: 'Numerik',
    moduleCredits: 5,
    moduleLanguage: 'English',
    moduleApplicability: 'B.Sc. Mathematik'
  };
  await db.addModul(
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
  db.deleteModulById(newModule.moduleID);
});

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
    await db.addModul(
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
    db.deleteModulById(newModules[parseInt(i)].moduleID);
  }
});

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
  await db.addModul(
    newModule1.moduleID,
    newModule1.moduleName,
    newModule1.moduleCredits,
    newModule1.moduleLanguage,
    newModule1.moduleApplicability
  );
  await db.addModul(
    newModule2.moduleID,
    newModule2.moduleName,
    newModule2.moduleCredits,
    newModule2.moduleLanguage,
    newModule2.moduleApplicability
  );
  await db.addModul(
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
  console.log(response.body);
  expect(response.body).toContainEqual(expect.objectContaining(newModule1));
  expect(response.body).toContainEqual(expect.objectContaining(newModule2));
  db.deleteModulById(newModule1.moduleID);
  db.deleteModulById(newModule2.moduleID);
  db.deleteModulById(newModule3.moduleID);
});

test('GET /api/intern/getIncompleteModules: It should return all the incomplete modules', async () => {
  // insert modules
  const newModule0 = {
    moduleID: Math.floor(Math.random() * 10000000).toString(),
    moduleName: 'Numerik',
    moduleCredits: 5,
    moduleLanguage: 'English',
    moduleApplicability: 'B.Sc. Mathematik'
  };
  const newModule1 = {
    moduleID: Math.floor(Math.random() * 10000000).toString(),
    moduleName: '',
    moduleCredits: 5,
    moduleLanguage: 'English',
    moduleApplicability: 'B.Sc. Mathematik'
  };
  const newModule2 = {
    moduleID: Math.floor(Math.random() * 10000000).toString(),
    moduleName: 'Numerik',
    moduleCredits: -1,
    moduleLanguage: 'English',
    moduleApplicability: 'B.Sc. Mathematik'
  };
  const newModule3 = {
    moduleID: Math.floor(Math.random() * 10000000).toString(),
    moduleName: 'Numerik',
    moduleCredits: 5,
    moduleLanguage: '',
    moduleApplicability: 'B.Sc. Mathematik'
  };
  const newModule4 = {
    moduleID: Math.floor(Math.random() * 10000000).toString(),
    moduleName: 'Numerik',
    moduleCredits: 5,
    moduleLanguage: 'English',
    moduleApplicability: ''
  };
  const newModule5 = {
    moduleID: Math.floor(Math.random() * 10000000).toString(),
    moduleName: '',
    moduleCredits: -1,
    moduleLanguage: '',
    moduleApplicability: ''
  };
  await db.addModul(
    newModule0.moduleID,
    newModule0.moduleName,
    newModule0.moduleCredits,
    newModule0.moduleLanguage,
    newModule0.moduleApplicability
  );
  await db.addModul(
    newModule1.moduleID,
    newModule1.moduleName,
    newModule1.moduleCredits,
    newModule1.moduleLanguage,
    newModule1.moduleApplicability
  );
  await db.addModul(
    newModule2.moduleID,
    newModule2.moduleName,
    newModule2.moduleCredits,
    newModule2.moduleLanguage,
    newModule2.moduleApplicability
  );
  await db.addModul(
    newModule3.moduleID,
    newModule3.moduleName,
    newModule3.moduleCredits,
    newModule3.moduleLanguage,
    newModule3.moduleApplicability
  );
  await db.addModul(
    newModule4.moduleID,
    newModule4.moduleName,
    newModule4.moduleCredits,
    newModule4.moduleLanguage,
    newModule4.moduleApplicability
  );
  await db.addModul(
    newModule5.moduleID,
    newModule5.moduleName,
    newModule5.moduleCredits,
    newModule5.moduleLanguage,
    newModule5.moduleApplicability
  );

  const response = await request(app).get('/api/intern/getIncompleteModules');
  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(5);
  expect(response.body).toContainEqual(expect.objectContaining(newModule1));
  expect(response.body).not.toContainEqual(expect.objectContaining(newModule0));

  // wrap up
  db.deleteModulById(newModule0.moduleID);
  db.deleteModulById(newModule1.moduleID);
  db.deleteModulById(newModule2.moduleID);
  db.deleteModulById(newModule3.moduleID);
  db.deleteModulById(newModule4.moduleID);
  db.deleteModulById(newModule5.moduleID);
});

test('GET /api/intern/getIncompleteModules: It should respond with an empty array if no module is incomplete', async () => {
  const response1 = await request(app).get('/api/intern/getIncompleteModules');
  expect(response1.statusCode).toBe(200);
  expect(response1.body.length).toBe(0);
  // add a module
  const newModule = {
    moduleID: Math.floor(Math.random() * 10000000).toString(),
    moduleName: 'Numerik',
    moduleCredits: 5,
    moduleLanguage: 'English',
    moduleApplicability: 'B.Sc. Mathematik'
  };
  await db.addModul(
    newModule.moduleID,
    newModule.moduleName,
    newModule.moduleCredits,
    newModule.moduleLanguage,
    newModule.moduleApplicability
  );

  const response2 = await request(app).get('/api/intern/getIncompleteModules');
  expect(response2.statusCode).toBe(200);
  expect(response2.body.length).toBe(0);

  db.deleteModulById(newModule.moduleID);
});
