import axios from 'axios';

// create a axios object to send http requests
const http = axios.create({
  baseURL: `${window.location.origin}/api/intern`,
  headers: {
    'Content-type': 'application/json'
  }
});
// modified from https://www.bezkoder.com/react-hooks-crud-axios-api/

/**
 * send post request with new database object
 * @param data contains the entries made by the user for each of the input fields (id, name, credits, language, applicability)
 * @returns a promise that is rejected or fulfilled depending on the success of adding the module
 */
const create = (data: object) => {
  const x = http.post('/addModul', data);
  return x;
};

/**
 * send put request with modified database object with ID id
 * @param id states the id of the database object to be modified
 * @param data contains the entries made by the user for each of the input fields (id, name, credits, language, applicability)
 * @returns {Promise<AxiosResponse>} a promise that is rejected or fulfilled depending on the success of updating the module
 */
const update = (id: string, data: object) => {
  return http.put(`/updateModule/${encodeURIComponent(id)}`, data);
};

/**
 * send get request for ID id
 * @param id states the id of the database object to be found
 * @returns {Promise<AxiosResponse>}a promise that is rejected or fulfilled depending on the success of getting the module
 */
const getByID = (id: string) => {
  return http.get(`/getOneModule/${encodeURIComponent(id)}`);
};

/**
 * sends get request with the parameters of the module(s) that want to be retrieved
 * @param id
 * @param name
 * @param credits
 * @param language
 * @param applicability
 * @returns a promise that is rejected or fulfilled depending on the success of getting the module(s), it rejects if there is a problem with the database or more than 50 modules match the request
 */
const getModules = (
  id: string,
  name: string,
  credits: string,
  language: string,
  applicability: string
) => {
  return http.get(
    `/getModules/${encodeURIComponent(id)}/${encodeURIComponent(
      name
    )}/${encodeURIComponent(credits)}/${encodeURIComponent(
      language
    )}/${encodeURIComponent(applicability)}`
  );
};

const ModuleServices = {
  create,
  update,
  getByID,
  getModules
};

export default ModuleServices;
