import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:80/api",
  //baseURL: "http://${config.server.HOST}:${config.server.PORT_HTTP}/api",
//timeout: 2000,
  headers: {
    "Content-type": "application/json"
  }
})
// https://www.bezkoder.com/react-hooks-crud-axios-api/
/*
const getAll = () => {
  return http.get("/tutorials");
};

const get = id => {
  return http.get(`/tutorials/${id}`);
};
*/

const create = data => {
  return http.post("/addModul", data);
};

/*
const update = (id, data) => {
  return http.put(`/tutorials/${id}`, data);
};

const remove = id => {
  return http.delete(`/tutorials/${id}`);
};

const removeAll = () => {
  return http.delete(`/tutorials`);
};

const findByTitle = title => {
  return http.get(`/tutorials?title=${title}`);
};
*/
const ModuleServices = {
/*  getAll,
  get,*/
  create,
/*  update,
  remove,
  removeAll,
  findByTitle*/
};

export default ModuleServices;