// Import the ExaminationRegulation model from the database.
const ExamRegulation = require('./database.js').models.ExaminationRegulation;

/**
 * @function addExamRegulation
 * @description This function adds a new examination regulation to the database or updates an existing one if the name already exists.
 * @param {Object} examRegulationSchema - The schema of the examination regulation to be added or updated.
 * @param {string} internalName - The internal name of the examination regulation.
 * @returns {Promise<Object>} The created or updated examination regulation.
 */
const addExamRegulation = async (examRegulationSchema, internalName) => {
  // Check if the examination regulation with the given internal name already exists.
  const existingRegulation = await ExamRegulation.findOne({
    where: {
      name: internalName
    }
  });

  if (existingRegulation) {
    // If the regulation exists, update it with the new schema.
    existingRegulation.jsonSchema = JSON.stringify(examRegulationSchema);
    return existingRegulation.save();
  } else {
    // If the regulation does not exist, create a new one.
    const newRegulation = {
      jsonSchema: JSON.stringify(examRegulationSchema),
      name: internalName
    };

    // Add the examination regulation to the database.
    return ExamRegulation.create(newRegulation).catch((err) => {
      throw new Error(err);
    });
  }
};

/**
 * @function isExamRegulationExists
 * @description This function checks if an examination regulation exists in the database.
 * @param {string} internalName - The internal name of the examination regulation.
 * @returns {Promise<boolean>} Whether the examination regulation exists.
 */
const isExamRegulationExists = async (internalName) => {
  // Find the examination regulation in the database.
  return await ExamRegulation.findOne({
    where: {
      name: internalName
    }
  }).then((result) => !!result); // Convert the result to a boolean. If the result is not null, the examination regulation exists.
};
/**
 * Find the examination regulation in the database by name
 * @param {string} internalName the internal exam name
 * @returns {string} null if not found, else the exam regulation
 */
const getExamRegulation = async (internalName) => {
  // Find the examination regulation in the database.
  return ExamRegulation.findOne({
    where: {
      name: internalName
    }
  }).then((result) => result); // Convert the result to a boolean. If the result is not null, the examination regulation exists.
};

/**
 * @returns  Return all exam regulations
 */
const getAllExamRegulations = async () => {
  // return all exam regulations
  return await ExamRegulation.findAll();
};

// Export the functions.
module.exports = {
  addExamRegulation,
  isExamRegulationExists,
  getExamRegulation,
  getAllExamRegulations
};
