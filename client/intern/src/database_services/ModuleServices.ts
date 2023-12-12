import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:80/api", // hardcoded for the moment
  headers: {
    "Content-type": "application/json"
  }
})
// modified from https://www.bezkoder.com/react-hooks-crud-axios-api/

const create = (data : object) => {
  return http.post("/addModul", data);
};

const ModuleServices = {
  create
};

export default ModuleServices;