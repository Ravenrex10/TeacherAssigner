const { ipcRenderer } = require('electron');

// Function to load teachers and populate the table
async function loadTeachers() {
    try {
        const teachers = await ipcRenderer.invoke('get-teachers');
        const tableBody = document.getElementById('teachers-table-body');

        // Clear any existing rows
        tableBody.innerHTML = '';

        // Populate the table with teachers
        teachers.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border-b">${teacher.teacher_id}</td>
                <td class="py-2 px-4 border-b">${teacher.first_name}</td>
                <td class="py-2 px-4 border-b">${teacher.last_name}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load teachers:', error);
    }
}

// Load teachers when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadTeachers);