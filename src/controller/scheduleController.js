let draggedCell = null;
let weekDayDictionary = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday"
}
const addRowForm = document.getElementById('add-row-form');

// Function to set up drag-and-drop for the table cells
const setUpDraggableCells = () => {
    $('.draggable').off('dragstart').on('dragstart', function (e) {
        draggedCell = this;
        e.originalEvent.dataTransfer.effectAllowed = 'move';
    });

    $('.draggable').off('dragover').on('dragover', function (e) {
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'move';
    });

    $('.draggable').off('drop').on('drop', function (e) {
        e.preventDefault();
        if (draggedCell) {
            const draggedSelect = $(draggedCell).find('select').first();
            const targetSelect = $(this).find('select').first();

            // Swap the selected values without resetting
            const draggedValue = draggedSelect.val();
            const targetValue = targetSelect.val();

            draggedSelect.val(targetValue); // Set target value in dragged select
            targetSelect.val(draggedValue); // Set dragged value in target select

            draggedCell = null; // Reset dragged cell
        }
    });
};

const addNewRow = (area, teachers, assignments) => {
    
    let filteredAssignments = assignments.filter(assignment => assignment.area_id === area.id);

    const tableBody = $('#teacher-table tbody');
    const newRow = document.createElement('tr');
    newRow.className = 'bg-white hover:bg-gray-50 text-center';


    // Create the first column with the area name
    const areaCell = document.createElement('td');
    areaCell.className = 'border border-gray-300'; // Cell styling
    areaCell.innerText = area.areaName;
    newRow.append(areaCell);

    // Create the remaining columns for teacher selections
    for (let i = 0; i < 5; i++) { // 5 days

        const cell = document.createElement('td');
        cell.className = 'draggable border border-gray-300';
        cell.setAttribute('draggable', 'true');

        const select = document.createElement('select');

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'None';
        select.append(defaultOption);

        // Add teacher options to the select element
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.firstName;
            option.textContent = teacher.firstName;

            // Check if the teacher has an assignment in filteredAssignments
            const assignedTeacher = filteredAssignments.find(assignment => assignment.teacher_id === teacher.id && weekDayDictionary[i] === assignment.weekDay);

            // If the teacher is in filteredAssignments, set the option as selected
            if (assignedTeacher) {
                option.selected = true;
            }

            select.append(option);
        });

        cell.append(select);
        newRow.append(cell);
    }

    const timeCell = document.createElement('td');
                    timeCell.className = 'border border-gray-300';
                    timeCell.innerText = area.areaTime;
                    newRow.append(timeCell);

    const deleteCell = document.createElement('td');
    deleteCell.innerHTML = `
        <td class="py-2 px-4 text-center" style="width: 5px;">
            <button class="delete-button text-red-500 hover:text-red-700 font-semibold">X</button>
        </td>
    `;
    newRow.append(deleteCell);
    

    // Append the new row to the table
    tableBody.append(newRow);

    // Add an event listener to the delete button
    newRow.querySelector('.delete-button').addEventListener('click', () => {
        window.areaApi.deleteArea(area.id); // Call a function to delete the teacher
        newRow.remove(); // Remove the row from the table
    });

    // Set up draggable for the newly added row
    setUpDraggableCells();
};

const calculateTotalTime = (teacher, areas, assignments) => {
    let filteredAssignments = assignments.filter(assignment => assignment.teacher_id === teacher.id);
    let totalTime = 0;

    filteredAssignments.forEach(assignment => {
        let area = areas.find(area => area.id === assignment.area_id);
        if (area) {
            totalTime += area.areaTime;
        }
    });

    return totalTime;
};

const populateScheduleTable = (teachers, areas, assignments) => {
    areas.forEach(area => {
        addNewRow(area, teachers, assignments)
    });
}

addRowForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    
    // Get values from the input fields
    const areaName = document.getElementById('areaName').value;
    const areaTime = document.getElementById('areaTime').value;

    // Call the function from teachers.js
    window.areaApi.addArea(areaName, areaTime);
    location.reload();
});

document.addEventListener('DOMContentLoaded', async () => {
    let teachers = window.teacherApi.getNames();
    let areas = window.areaApi.getAreas();
    let assignments = window.assignmentApi.getAssignments();

    setUpDraggableCells();
    populateScheduleTable(teachers, areas, assignments);
    
    teachers.forEach(teacher => {
        let totalTime = calculateTotalTime(teacher, areas, assignments);
        const teacherList = $('#teachers-times'); // Using jQuery to select the element
        const listItem = $('<li>'); // Create the list item with jQuery
        listItem.text(`${teacher.firstName} ${teacher.lastName}: ${totalTime} minutes`); // Set the text with jQuery
        teacherList.append(listItem); // Append the list item to the teacher list
    });
    
})