const teachers = require('./src/models/teachersModel');
const { contextBridge } = require('electron')

const getNames = () => {
  return teachers.getNames();
}
contextBridge.exposeInMainWorld("api", {
  getNames: getNames
});