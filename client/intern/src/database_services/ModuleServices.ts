import axios from "axios";


// create a axios object to send http requests
const http = axios.create({
  baseURL: `${window.location.origin}/api/intern`,
  headers: {
    "Content-type": "application/json"
  }
})
// modified from https://www.bezkoder.com/react-hooks-crud-axios-api/


/**
 * send post request with new database object
 * @param data contains the entries made by the user for each of the input fields (id, name, credits, language, applicability)
 * @returns a promise that is rejected or fulfilled depending on the success of adding the module
 */
const create = (data : object) => {
  return http.post("/addModul", data);
};


const getModules = (id:string, name:string, credits:string, language:string, applicability:string)  => {
  return http.get(`/getModules/${id}/${name}/${credits}/${language}/${applicability}`)
}



const ModuleServices = {
  create,
  getModules
};

export default ModuleServices;