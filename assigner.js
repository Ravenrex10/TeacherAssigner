// Add click event listener to the button
document.getElementById('convert-button').addEventListener('click', () => {
    // Get the table body rows
    const rows = document.querySelectorAll('#teacher-table tbody tr');
    
    // Initialize an empty matrix (2D array)
    const matrix = [];
    
    // Iterate over each row
    rows.forEach(row => {
        const rowData = []; // Array to hold cell data for each row
        
        // Get all the cells (td) in the current row
        const cells = row.querySelectorAll('td');
        
        // Iterate over each cell and get the value
        cells.forEach(cell => {
            // For input cells, get the value from the input field
            const input = cell.querySelector('input');
            if (input) {
                rowData.push(input.value); // Push the input value to the row array
            }
            
            // For select cells, get the selected option value
            const select = cell.querySelector('select');
            if (select) {
                rowData.push(select.value); // Push the selected option to the row array
            }
        });
        
        // Push the row data array into the matrix
        matrix.push(rowData);
    });
    
    assign(matrix)
});

function assign(matrix){
    // Fetch teacher data from JSON file
    fetch('../data/teachers.json')
    .then((response) => response.json())
    .then((json) => {
        teachers_json = json;

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
        value = resetAndAssignTeachers(teachers, matrix);
        matrix = value.updatedAreasMatrix;
        teachers = value.updatedTeachers;
        console.log(matrix);
    });
}

function resetAndAssignTeachers(teachers, areasMatrix) {
    // Reset each teacher's timeframes
    teachers.forEach(teacher => {
        teacher.timeframes = [];
    });

    // Reset the areasMatrix teacher names (set them all to empty)
    areasMatrix.forEach((areaRow) => {
        for (let i = 1; i < areaRow.length - 1; i++) {
            areaRow[i] = ""; // Reset all teacher columns in the matrix
        }
    });

    // Days mapping based on column index
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // Array to store total time assigned to each teacher
    const teacherTime = {};
    teachers.forEach(teacher => {
        teacherTime[teacher.name] = 0;
    });

    // Assign teachers to areas in a balanced way
    areasMatrix.forEach((areaRow, rowIndex) => {
        const areaName = areaRow[0]; // The area name is the first element in each row
        const areaTime = parseInt(areaRow[6], 10); // The time is the last element in each row

        // Iterate over the days (Monday to Friday)
        for (let i = 1; i < areaRow.length - 1; i++) {
            const currentDay = days[i - 1]; // Get the day based on the column index

            // Find the teacher with the least assigned time
            let selectedTeacher = teachers.reduce((minTeacher, teacher) => {
                return teacherTime[teacher.name] < teacherTime[minTeacher.name] ? teacher : minTeacher;
            });

            // Assign the teacher to this area and day
            areaRow[i] = selectedTeacher.name; // Update the matrix with the selected teacher

            // Update the teacher's timeframes with this new assignment
            let dayEntry = selectedTeacher.timeframes.find(tf => tf.day === currentDay);
            if (!dayEntry) {
                dayEntry = { day: currentDay, areas: [] };
                selectedTeacher.timeframes.push(dayEntry);
            }

            // Add the area and time to the current day
            dayEntry.areas.push({ name: areaName, time: areaTime });

            // Update the total time for this teacher
            teacherTime[selectedTeacher.name] += areaTime;
        }
    });

    return { updatedTeachers: teachers, updatedAreasMatrix: areasMatrix };
}