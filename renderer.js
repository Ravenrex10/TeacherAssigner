


window.onload = () => {
    // Define areas for the first column

    let draggedCell = null;
    let teachers

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

    // Initial setup for the existing rows
    setUpDraggableCells();

    // Event listener for adding a new row
    //$('#add-row-btn').on('click', addNewRow);

    /**
     * PARSE JSON TEACHERS
     */

    let teachers_json;
    // Fetch teacher data from JSON file
    fetch('../data/teachers.json')
        .then((response) => response.json())
        .then((json) => {
            teachers_json = json;

            // Dynamically create teacher objects based on fetched data
            teachers = teachers_json.map(teacher => {
                return {
                    name: teacher.name,
                    timeframes: teacher.timeframes.map(timeframe => {
                        //return `${timeframe.areas[0].name} on ${timeframe.day}`;
                        return {
                            day: timeframe.day,
                            areas: timeframe.areas.map(area => {
                                return{
                                    name: area.name,
                                    time: area.time
                                }
                            })
                        }
                    })
                };
            });

            // Dynamically create rows based on areas
            const tableBody = document.querySelector('#teacher-table tbody');
            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

            // Get all the rows in the table body
            //const rows = document.querySelectorAll('#teacher-table tbody tr');

            var areas
            fetch('../data/areas.json') // Ensure the path is correct relative to your HTML file
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((areas) => {

                    areas.forEach((currentArea, rowIndex) => {
                        // Create a new row for each area
                        const row = document.createElement('tr');
                        row.className = 'bg-white hover:bg-gray-50';
            
                        // Create the first column with the area name
                        const areaCell = document.createElement('td');
                        const areaInput = document.createElement('input');
                        areaInput.value = currentArea.name; // Fill the input with the area name
                        //areaInput.className = 'border border-gray-300 bg-gray-200 text-gray-800 w-full px-2 py-1';
                        areaCell.appendChild(areaInput);
                        areaCell.className = 'border border-gray-300'; // Cell styling
                        row.appendChild(areaCell);
            
                        // Create the rest of the columns for each day (Monday to Friday)
                        days.forEach((day, dayIndex) => {
                            const cell = document.createElement('td');
                            cell.className = 'draggable border border-gray-300';
                            cell.setAttribute('draggable', 'true');
            
                            const select = document.createElement('select');
                            select.name = 'teacher.name';
                            select.id = `teachers-${rowIndex}-${dayIndex}`;
            
                            // Default option
                            const defaultOption = document.createElement('option');
                            defaultOption.value = '';
                            defaultOption.textContent = 'None';
                            select.appendChild(defaultOption);
            
                            // Populate the select with teachers
                            teachers.forEach(teacher => {
                                const option = document.createElement('option');
                                option.value = teacher.name;
                                option.textContent = teacher.name;
            
                                // Check if the teacher has a timeframe that matches the current area and day
                                const timeframeMatch = teacher.timeframes.find(timeframe => {
                                    return timeframe.day === day && 
                                        timeframe.areas.some(area => area.name === currentArea.name);
                                });
            
                                if (timeframeMatch) {
                                    option.selected = true; // Set this option as selected if a matching timeframe is found
                                }
            
                                select.appendChild(option);
                            });
            
                            cell.appendChild(select);
                            row.appendChild(cell);
                        });

                        const timeCell = document.createElement('td');
                        const timeInput = document.createElement('input');
                        timeInput.value = currentArea.time;
                        timeCell.appendChild(timeInput);
                        timeCell.className = 'border border-gray-300';
                        row.appendChild(timeCell);
            
                        // Append the new row to the table body
                        tableBody.appendChild(row);
                    });

                    
                    // Initialize draggable functionality for rows once data is populated
                    setUpDraggableCells();
            })

        });

    $(document).ready(function () {
        
    });

// Function to add a new row
    const addNewRow = () => {
        const tableBody = $('#teacher-table tbody');
        const newRow = $('<tr>').addClass('bg-white hover:bg-gray-50');

        // Create the first column for the new row
        //const areaCell = $('<td>');
        
        // Create an input element for the area name
        //const areaInput = $('<input>').val(' ').addClass('border border-gray-300 bg-gray-200 text-gray-800 w-full px-2 py-1');

        // Create the first column with the area name
        const areaCell = document.createElement('td');
        const areaInput = document.createElement('input');
        //areaInput.className = 'border border-gray-300 bg-gray-200 text-gray-800 w-full px-2 py-1';
        areaCell.append(areaInput);
        areaCell.className = 'border border-gray-300'; // Cell styling
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
                                option.value = teacher.name;
                                option.textContent = teacher.name;
                select.append(option);
            });

            cell.append(select);
            newRow.append(cell);
        }

        const timeCell = document.createElement('td');
                        const timeInput = document.createElement('input');
                        timeInput.value = 0;
                        timeCell.append(timeInput);
                        timeCell.className = 'border border-gray-300';
                        newRow.append(timeCell);

        // Append the new row to the table
        tableBody.append(newRow);

        // Set up draggable for the newly added row
        setUpDraggableCells();
    };

    // Initial setup for the existing rows
    setUpDraggableCells();

    // Event listener for adding a new row
    $('#add-row-btn').on('click', addNewRow);
};
