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

const addArea = (areaName) => {
  areas.addArea(areaName);
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

const swapAssignments = (assignmentA, assignmentB) => {
  assignments.swapAssignments(assignmentA, assignmentB);
}

const updateAssignment = (teacherId, areaId, weekDay, breakType, breakHalf) => {
  assignments.updateAssignment(teacherId, areaId, weekDay, breakType, breakHalf);
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
  createAssignments : createAssignments,
  swapAssignments : swapAssignments,
  updateAssignment : updateAssignment
});