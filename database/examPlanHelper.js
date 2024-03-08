// Import the ExaminationRegulation model from the database.
const ExamPlan = require('./database.js').models.ExamPlan;
const logger = require('../logger');

const addExamPlan = async (
  examPlanString,
  name
) => {
  const newPlan = {
    jsonSchema: examPlanString,
    name,
    approvalDate: null
  };

  return ExamPlan.create(newPlan).catch((err) => {
    throw new Error(err);
  });
};

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
  } catch (error) {
    logger.error('Error deleting module:', error);
    return false; // Return false if an error occurs during deletion
  }
};

// Export the functions.
module.exports = {
  addExamPlan,
  deleteExamPlan
};
