const teachers = require('./src/models/teachersModel');
const areas = require('./src/models/areaModel');
const assignments = require('./src/models/assignmentModel');
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

const getAssignments = () => {
  return assignments.getAssignments();
}

const addArea = (areaName, areaTime) => {
  areas.addArea(areaName, areaTime);
}

const deleteArea = (areaId) => {
  areas.deleteArea(areaId);
}

const deleteAll = () => {
  assignments.deleteAll();
}

const createAssignments = (assignmentList) => {
  assignments.createAssignments(assignmentList);
}

contextBridge.exposeInMainWorld("teacherApi", {
  getNames: getNames,
  addTeacher: addTeacher,
  deleteTeacher: deleteTeacher
});

contextBridge.exposeInMainWorld("areaApi", {
  getAreas: getAreas,
  addArea : addArea,
  deleteArea : deleteArea
});

contextBridge.exposeInMainWorld("assignmentApi", {
  getAssignments: getAssignments,
  deleteAll : deleteAll,
  createAssignments : createAssignments
});