const ExamPlan = require('./database.js').models.ExamPlan;
const logger = require('../logger');

/**
 *
 * @param {string} examPlanString
 * @param {string} name
 * @param {string} typeOfPlan
 * @returns A promise that resolves to the saved exam Plan if the request is successful.
 */
const addExamPlan = async (
  examPlanString,
  name,
  typeOfPlan
) => {
  const newPlan = {
    jsonSchema: examPlanString,
    name,
    approvalDate: null,
    typeOfPlan
  };

  return ExamPlan.create(newPlan).catch((err) => {
    // should only happen if connection to database breaks (not tested)
    throw new Error(err);
  });
};

/**
 *
 * @param {number} ID
 * @returns A promise that resolves to true if the exam plan is deleted, false otherwise
 */
const deleteExamPlan = async (ID) => {
  try {
    logger.info(`Deleting ExamPlan with ID ${ID}...`);
    const affectedRows = await ExamPlan.destroy({
      where: {
        id: ID
      }
    });

    // If affectedRows is greater than 0, it means at least one record was deleted
    return affectedRows > 0;
  } catch (error) { // should only happen if connection to database breaks (not tested)
    logger.error('Error deleting exam plan:', error);
    return false; // Return false if an error occurs during deletion
  }
};

/**
 *
 * @param {number} id
 * @returns A promise that resolves to true if the exam plan already exists
 */
const isExamPlanExists = async (id) => {
  return await ExamPlan.findOne({
    where: {
      id
    }
  }).then((result) => !!result);
};

/**
 *
 * @param {number} id
 * @returns A promise that resolves to the exam plan if found
 */
const getExamPlan = async (id) => {
  return ExamPlan.findOne({
    where: {
      id
    }
  }).then((result) => result);
};

module.exports = {
  addExamPlan,
  deleteExamPlan,
  isExamPlanExists,
  getExamPlan
};
