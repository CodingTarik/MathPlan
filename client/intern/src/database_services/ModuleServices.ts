import axios from "axios";


// create a axios object to send http requests
const http = axios.create({
  baseURL: `${window.location.origin}/api`,
  headers: {
    "Content-type": "application/json"
  }
})
// modified from https://www.bezkoder.com/react-hooks-crud-axios-api/


// send post request with new database obejct
const create = (data : object) => {
  return http.post("/addModul", data);
};

const ModuleServices = {
  create
};

export default ModuleServices;