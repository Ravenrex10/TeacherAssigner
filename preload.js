const teachers = require('./src/models/teachersModel');
const areas = require('./src/models/areaModel');
const { contextBridge } = require('electron')

const getNames = () => {
  return teachers.getNames();
}

const addTeacher = (firstName, lastName) => {
  teachers.addTeacher(firstName, lastName);
}

const deleteTeacher = (teacherId) => {
  teachers.deleteTeacher(teacherId);
}

const getAreas = () => {
  return areas.getAreas();
}

contextBridge.exposeInMainWorld("teacherApi", {
  getNames: getNames,
  addTeacher: addTeacher,
  deleteTeacher: deleteTeacher
});

contextBridge.exposeInMainWorld("areaApi", {
  getAreas: getAreas
})