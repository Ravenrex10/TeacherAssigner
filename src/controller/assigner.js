let teachers = window.teacherApi.getNames();
let areas = window.areaApi.getAreas();

const assignButton = document.getElementById("assign-teachers-button");

const assignTeachers = () => {
    // Clear previous assignments
    window.assignmentApi.deleteAll();


};


assignButton.addEventListener("click", (event) => {
    event.preventDefault();

    assignTeachers();
    location.reload();
});