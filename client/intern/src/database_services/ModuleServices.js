import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:80/api",
  /**
   @todo
   */
  //baseURL: "http://${config.server.HOST}:${config.server.PORT_HTTP}/api", //not hard coded
  headers: {
    "Content-type": "application/json"
  }
})
// modified from https://www.bezkoder.com/react-hooks-crud-axios-api/

const create = data => {
  return http.post("/addModul", data);
};

const ModuleServices = {
  create
};

export default ModuleServices;