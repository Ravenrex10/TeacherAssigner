const teachers = require('./src/models/teachersModel');
const { contextBridge } = require('electron')

const getNames = () => {
  return teachers.getNames();
}

const addTeacher = (firstName, lastName) => {
  teachers.addTeacher(firstName, lastName);
}

contextBridge.exposeInMainWorld("teacherApi", {
  getNames: getNames,
  addTeacher: addTeacher
});