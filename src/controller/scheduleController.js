
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

            // Swap the values in the UI
            draggedSelect.val(targetValue); // Set target value in dragged select
            targetSelect.val(draggedValue); // Set dragged value in target select

            // Get data attributes for the dragged and target cells
            const draggedData = {
                teacher_id: draggedValue,
                area_id: draggedSelect.data('areaId'),
                weekDay: draggedSelect.data('weekDay'),
                breakType: draggedSelect.data('breakType'),
                breakHalf: draggedSelect.data('breakHalf')
            };

            const targetData = {
                teacher_id: targetValue,
                area_id: targetSelect.data('areaId'),
                weekDay: targetSelect.data('weekDay'),
                breakType: targetSelect.data('breakType'),
                breakHalf: targetSelect.data('breakHalf')
            };

            // Call a function to update the database for both cells
            assignmentApi.swapAssignments(draggedData, targetData);
            

            draggedCell = null; // Reset dragged cell

            location.reload();
        }
    });
};

const addNewRow = (area, teachers, assignments) => {
    let filteredAssignments = assignments.filter(assignment => assignment.area_id === area.id);
    const tableBody = $('#teacher-table tbody');
    
    // Create 4 rows for each break type and half
    const breakTypes = [
        { type: 'recess', half: 1, label: '1st Recess' },
        { type: 'recess', half: 2, label: '2nd Recess' },
        { type: 'lunch', half: 1, label: '1st Lunch' },
        { type: 'lunch', half: 2, label: '2nd Lunch' }
    ];
    
    breakTypes.forEach((breakInfo, index) => {
        const newRow = document.createElement('tr');
        newRow.className = 'bg-white hover:bg-gray-50 text-center';
        
        // Create the first column with area name and break type
        const areaCell = document.createElement('td');
        areaCell.className = 'border border-gray-300';
        // Only show area name in first row, otherwise show just the break type
        areaCell.innerText = `${area.areaName} - ${breakInfo.label}`;
        newRow.append(areaCell);
        
        // Create the remaining columns for teacher selections (5 days)
        for (let i = 0; i < 5; i++) {
            const cell = document.createElement('td');
            cell.className = 'draggable border border-gray-300';
            cell.setAttribute('draggable', 'true');
            
            const select = document.createElement('select');
            select.className = 'p-1';
            
            // Add data attributes for break type and half
            select.dataset.breakType = breakInfo.type;
            select.dataset.breakHalf = breakInfo.half;
            select.dataset.weekDay = weekDayDictionary[i];
            select.dataset.areaId = area.id;
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'None';
            select.append(defaultOption);
            
            // Add teacher options to the select element
            teachers.forEach(teacher => {
                const option = document.createElement('option');
                option.value = teacher.id;
                option.textContent = teacher.firstName;
                
                // Check if the teacher is assigned for this specific break and day
                const assignedTeacher = filteredAssignments.find(assignment => 
                    assignment.teacher_id === teacher.id && 
                    weekDayDictionary[i] === assignment.weekDay &&
                    assignment.breakType === breakInfo.type &&
                    assignment.breakHalf === breakInfo.half
                );
                
                if (assignedTeacher) {
                    option.selected = true;
                }
                
                select.append(option);
            });
            
            // Add change event listener to handle assignment updates
            select.addEventListener('change', (event) => {
                const teacherId = event.target.value;
                const weekDay = event.target.dataset.weekDay;
                const breakType = event.target.dataset.breakType;
                const breakHalf = parseInt(event.target.dataset.breakHalf);
                const areaId = event.target.dataset.areaId;
                
                // Update assignments logic here
                window.assignmentApi.updateAssignment(teacherId, areaId, weekDay, breakType, breakHalf);

                location.reload();
            });
            
            cell.append(select);
            newRow.append(cell);
        }
        
        // Add time cell showing the duration for this break period
        const timeCell = document.createElement('td');
        timeCell.className = 'border border-gray-300';
        timeCell.innerText = BREAK_TIMES[breakInfo.type][breakInfo.half] + ' min';
        newRow.append(timeCell);
        
        // Add delete button only to the first row
        const deleteCell = document.createElement('td');
        if (index === 0) {
            deleteCell.innerHTML = `
                <td class="py-2 px-4 text-center" style="width: 5px;">
                    <button class="delete-button text-red-500 hover:text-red-700 font-semibold">X</button>
                </td>
            `;
            
            // Add delete button event listener
            deleteCell.querySelector('.delete-button').addEventListener('click', () => {
                window.areaApi.deleteArea(area.id);
                // Remove all 4 rows associated with this area
                const rowsToRemove = 4;
                let currentRow = newRow;
                for (let i = 0; i < rowsToRemove; i++) {
                    const rowToRemove = currentRow;
                    currentRow = currentRow.nextSibling;
                    rowToRemove.remove();
                }
            });
        }
        newRow.append(deleteCell);
        
        // Append the new row to the table
        tableBody.append(newRow);
    });
    
    // Set up draggable for all newly added rows
    setUpDraggableCells();
};


const calculateTotalTime = (teacher, areas, assignments) => {
    let filteredAssignments = assignments.filter(assignment => assignment.teacher_id === teacher.id);
    let totalTime = 0;

    filteredAssignments.forEach(assignment => {
        totalTime += BREAK_TIMES[assignment.breakType][assignment.breakHalf];
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

    // Call the function from teachers.js
    window.areaApi.addArea(areaName);
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