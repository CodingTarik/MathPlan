import axios from 'axios';

/**
 * Sends an exam regulation to the server.
 *
 * @param {unknown} examRegulationAsJSON - The exam regulation to send, as a JSON object.
 * @param {string} internalExamRegulationName - The internal name of the exam regulation.
 * @returns {Promise<boolean>} A promise that resolves to true if the request is successful, and false otherwise.
 */
export async function saveExamRegulationFunction(
  examRegulationAsJSON: unknown,
  internalExamRegulationName: string
): Promise<boolean> {
  try {
    // Send a POST request to the server with the exam regulation and its internal name
    const response = await axios.post('/api/intern/addexamregulation', {
      examRegulation: examRegulationAsJSON,
      internalName: internalExamRegulationName
    });

    // If the request is successful, response.status will be 200
    // In this case, we return true
    if (response.status === 200) {
      return true;
    } else {
      // If the request is not successful, we return false
      console.log(response.data);
      return false;
    }
  } catch (error) {
    // If an error occurs during the request, we log the error and return false
    console.error(error);
    return false;
  }
}