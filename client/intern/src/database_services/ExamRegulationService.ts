import axios, { AxiosResponse } from 'axios';
import { ExamRegulation } from '../components/examRegulationSelect';

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
    console.error(error);
  }
  return false;
}

/**
 * Fetches the list of exam regulations from the server.
 */
export const fetchExamRegulations = async (
    setExamRegulations: React.Dispatch<React.SetStateAction<ExamRegulation[]>>
  ) => {
    try {
      // Send axios get request to /api/intern/getAllexamRegulationsMin
      const response: AxiosResponse<ExamRegulation[]> = await axios.get(
        '/api/intern/getAllexamRegulationsMin'
      );
      // Update the state with the fetched exam regulations
      setExamRegulations(response.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
