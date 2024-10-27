let draggedCell = null;

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

const addNewRow = (area, teachers) => {
    const tableBody = $('#teacher-table tbody');
    const newRow = $('<tr>').addClass('bg-white hover:bg-gray-50');

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
            select.append(option);
        });

        cell.append(select);
        newRow.append(cell);
    }

    const timeCell = document.createElement('td');
                    timeCell.className = 'border border-gray-300';
                    timeCell.innerText = area.areaTime;
                    newRow.append(timeCell);

    // Append the new row to the table
    tableBody.append(newRow);

    // Set up draggable for the newly added row
    setUpDraggableCells();
};

const populateScheduleTable = () => {
    let areas = window.areaApi.getAreas();
    let teachers = window.teacherApi.getNames();

    areas.forEach(area => {
        addNewRow(area, teachers)
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    setUpDraggableCells();
    populateScheduleTable();
})