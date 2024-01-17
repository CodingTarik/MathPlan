const request = require('supertest');
const app = require('../app').app;
const db = require('../database/database');
const configFile = require('../config.js');
const Sequelize = require('sequelize');

// setup
beforeAll(async () => {
  /**
   * Database connection configuration
   * @typedef {Object} DatabaseConfig
   * @property {string} database - The database name
   * @property {string} username - The database username
   * @property {string} password - The database password
   * @property {string} host - The database host
   * @property {string} dialect - The database dialect ('mysql' or 'sqlite')
   * @property {string} storage - The path to the SQLite file (only for SQLite)
   */
  // Define database connection parameters
  const config /** @type {DatabaseConfig} */ = {
    database: configFile.database.DB_DATABASE,
    username: configFile.database.DB_USER, // Your MySQL username
    password: configFile.database.DB_PASSWORD, // Your MySQL password
    host: configFile.database.DB_HOST,
    dialect: 'sqlite', // can be set to 'mysql' or 'sqlite'
    storage: 'database.test.sqlite' // For SQLite, define the path to the SQLite file
  };

  // create a sequelize object
  const sequelize = new Sequelize(config);

  // the table with the courses and its attributes is defined
  // here and below as well we write 'modul' instead of 'module' to clarify that we mean university modules not NodeJS modules
  /**
   * Sequelize model for university modules
   * @typedef {Object} ModulModel
   * @property {number} id - Artificial primary key for the module
   * @property {string} moduleID - The module ID
   * @property {string} moduleName - The module name
   * @property {number} moduleCredits - The number of credits for the module
   * @property {string} moduleLanguage - The language of the module
   * @property {string} moduleApplicability - The applicability of the module
   */

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
      allowNull: false
    },
    moduleCredits: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    moduleLanguage: {
      type: Sequelize.STRING,
      allowNull: false
    },
    moduleApplicability: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  db.setModul(Modul, sequelize);
  sequelize.sync();
  // wait 3 sec
  await new Promise(resolve => setTimeout(resolve, 3000));
});
// realeasing open connections
afterAll(() => {
  if (configFile.database.DB_DIALECT !== 'sqlite') {
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
  await db.addModul(newModule.moduleID, newModule.moduleName, newModule.moduleCredits, newModule.moduleLanguage, newModule.moduleApplicability);
  let response = await request(app)
    .get(`/api/intern/getModules/${newModule.moduleID}/${newModule.moduleName}/${newModule.moduleCredits}/${newModule.moduleLanguage}/${newModule.moduleApplicability}`);
  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(1);
  expect(response.body).toContainEqual(expect.objectContaining(newModule));
  response = await request(app)
    .get(`/api/intern/getModules/${newModule.moduleID}/${'undefined'}/${'undefined'}/${'undefined'}/${'undefined'}`);
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
    await db.addModul(newModule.moduleID, newModule.moduleName, newModule.moduleCredits, newModule.moduleLanguage, newModule.moduleApplicability);
  }
  const response = await request(app)
    .get(`/api/intern/getModules/${'undefined'}/${newModules[0].moduleName}/${newModules[0].moduleCredits}/${newModules[0].moduleLanguage}/${newModules[0].moduleApplicability}`);
  expect(response.statusCode).toBe(400);
  expect(response.text).toBe('The search request yielded more than 50 requests');
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
  const response = await request(app)
    .get(`/api/intern/getModules/${newModule.moduleID}/${newModule.moduleName}/${newModule.moduleCredits}/${newModule.moduleLanguage}/${newModule.moduleApplicability}`);
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
  await db.addModul(newModule1.moduleID, newModule1.moduleName, newModule1.moduleCredits, newModule1.moduleLanguage, newModule1.moduleApplicability);
  await db.addModul(newModule2.moduleID, newModule2.moduleName, newModule2.moduleCredits, newModule2.moduleLanguage, newModule2.moduleApplicability);
  await db.addModul(newModule3.moduleID, newModule3.moduleName, newModule3.moduleCredits, newModule3.moduleLanguage, newModule3.moduleApplicability);
  const response = await request(app)
    .get(`/api/intern/getModules/${newModule1.moduleID}/${newModule1.moduleName}/${newModule1.moduleCredits}/${newModule1.moduleLanguage}/${newModule1.moduleApplicability}`);
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
test('GET /api/intern/getOneModul/:id: It should return an existing module and respond with status code 200', async () => {
  // add module with random id
  const id = Math.floor(Math.random() * 10000000).toString();
  const newModule = {
    id,
    name: 'Test Module',
    credits: 5,
    language: 'English',
    applicability: 'Computer Science'
  };

  await db.addModul(newModule.id, newModule.name, newModule.credits, newModule.language, newModule.applicability);
  expect(await db.isModuleExists(newModule.id)).toBe(true);

  const response = await request(app)
    .get(`/api/intern/getOneModul/${id}`);
  const returnedModule = JSON.parse(response.text);
  expect(response.statusCode).toBe(200);
  expect(returnedModule.moduleID).toBe(newModule.id);
  expect(returnedModule.moduleCredits).toBe(newModule.credits);
  expect(returnedModule.moduleName).toBe(newModule.name);
  expect(returnedModule.moduleApplicability).toBe(newModule.applicability);
  expect(returnedModule.moduleLanguage).toBe(newModule.language);
});

test('PUT /api/intern/updateModul/:id: It should modify an existing module and respond with status code 200', async () => {
  // add module with random id
  const id = Math.floor(Math.random() * 10000000).toString();
  const newModule = {
    id,
    name: 'Test Module',
    credits: 4,
    language: 'English',
    applicability: 'Computer Science'
  };

  await db.addModul(newModule.id, newModule.name, newModule.credits, newModule.language, newModule.applicability);
  expect(await db.getAllModules()).toContainEqual(
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
    .put(`/api/intern/updateModul/${id}`)
    .send(modifiedModule);

  expect(response.statusCode).toBe(200);
  // Check if the module was modified in the database, wait 2 sec
  await new Promise(resolve => setTimeout(resolve, 2000));
  expect(await db.isModuleExists(newModule.id)).toBe(true);
  const tmp = await db.getOneModul(id);
  expect(tmp.moduleID).toBe(modifiedModule.id);
  expect(tmp.moduleCredits).toBe(modifiedModule.credits);
  expect(tmp.moduleName).toBe(modifiedModule.name);
  expect(tmp.moduleApplicability).toBe(modifiedModule.applicability);
  expect(tmp.moduleLanguage).toBe(modifiedModule.language);
  expect(await db.getAllModules()).not.toContainEqual(
    expect.objectContaining({
      moduleID: newModule.id,
      moduleName: newModule.name,
      moduleCredits: newModule.credits,
      moduleLanguage: newModule.language,
      moduleApplicability: newModule.applicability
    })
  );
});

test('PUT /api/intern/updateModul/:id: It should respond with a 400 status if data is not provided', async () => {
  const id = Math.floor(Math.random() * 10000000).toString();
  const response = await request(app).put(`/api/intern/updateModul/${id}`);
  expect(response.statusCode).toBe(400);
});
