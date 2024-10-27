const addTeacherForm = document.getElementById('add-teacher-form');

addTeacherForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    
    // Get values from the input fields
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    // Call the function from teachers.js
    window.teacherApi.addTeacher(firstName, lastName); 
    location.reload();
    
});

function populateTeachersTable (){
    let teachers = window.teacherApi.getNames();
    const tableBody = document.getElementById('teachers-table-body');

    tableBody.innerHTML = '';

    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4 border text-center">${teacher.firstName}</td>
            <td class="py-2 px-4 border text-center">${teacher.lastName}</td>
            <td class="py-2 px-4 text-center" style="width: 5px;">
                <button class="delete-button text-red-500 hover:text-red-700 font-semibold">X</button>
            </td>
        `;
    
        // Add the row to the table body
        tableBody.appendChild(row);
    
        // Add an event listener to the delete button
        row.querySelector('.delete-button').addEventListener('click', () => {
            window.teacherApi.deleteTeacher(teacher.id); // Call a function to delete the teacher
            row.remove(); // Remove the row from the table
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    populateTeachersTable();
})