let teachers = window.teacherApi.getNames();
let areas = window.areaApi.getAreas();
let weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const assignButton = document.getElementById("assign-teachers-button");

// Constants for break times
const BREAK_TIMES = {
    recess: {
        1: 15, // 1st recess
        2: 15  // 2nd recess
    },
    lunch: {
        1: 20, // 1st lunch
        2: 30  // 2nd lunch
    }
};

function createAssignments(teachers, areas, weekDays) {
    let assignments = [];
    
    // Initialize teacher times tracker
    let teacherTimes = {};
    teachers.forEach(teacher => {
        teacherTimes[teacher.id] = 0;
    });
    
    // For each day, break type, and half
    weekDays.forEach(weekDay => {
        ['recess', 'lunch'].forEach(breakType => {
            [1, 2].forEach(breakHalf => {
                // For each area, assign a teacher
                areas.forEach(area => {
                    // Find eligible teachers (not assigned to any area during this specific break time)
                    let eligibleTeachers = teachers.filter(teacher => {
                        return !assignments.some(assignment => 
                            assignment.teacher_id === teacher.id && 
                            assignment.weekDay === weekDay &&
                            assignment.breakType === breakType &&
                            assignment.breakHalf === breakHalf
                        );
                    });
                    
                    // If no eligible teachers, use all teachers (fallback)
                    if (eligibleTeachers.length === 0) {
                        eligibleTeachers = teachers;
                    }
                    
                    // Find teacher with minimum total time
                    let selectedTeacher = null;
                    let minTime = Infinity; // Initialize minTime to a very large value
                    let candidates = []; // Array to store teachers with the minimum time

                    eligibleTeachers.forEach(teacher => {
                        const teacherTime = teacherTimes[teacher.id];
                        if (teacherTime < minTime) {
                            minTime = teacherTime;
                            candidates = [teacher]; // Reset candidates array with the new minTime teacher
                        } else if (teacherTime === minTime) {
                            candidates.push(teacher); // Add to candidates if the time matches the current minTime
                        }
                    });

                    // If there are multiple candidates with the same minTime, pick one at random
                    if (candidates.length > 0) {
                        const randomIndex = Math.floor(Math.random() * candidates.length);
                        selectedTeacher = candidates[randomIndex];
                    }
                    
                    // Create the assignment
                    if (selectedTeacher) {
                        assignments.push({
                            teacher_id: selectedTeacher.id,
                            area_id: area.id,
                            weekDay: weekDay,
                            breakType: breakType,
                            breakHalf: breakHalf
                        });
                        
                        // Update teacher's total time using the BREAK_TIMES constant
                        teacherTimes[selectedTeacher.id] += BREAK_TIMES[breakType][breakHalf];
                    }
                });
            });
        });
    });
    
    // Calculate and log statistics
    const stats = calculateStats(teacherTimes, teachers);
    
    return assignments;
}

function calculateStats(teacherTimes, teachers) {
    const times = Object.values(teacherTimes);
    const stats = {
        minTime: Math.min(...times),
        maxTime: Math.max(...times),
        avgTime: times.reduce((a, b) => a + b, 0) / times.length,
        timePerTeacher: {}
    };
    
    teachers.forEach(teacher => {
        stats.timePerTeacher[`${teacher.firstName} ${teacher.lastName}`] = 
            teacherTimes[teacher.id];
    });
    
    return stats;
}

function validateAssignments(assignments, teachers, areas, weekDays) {
    const errors = [];
    
    // Check for concurrent assignments (same teacher, same day, same break type and half)
    weekDays.forEach(weekDay => {
        ['recess', 'lunch'].forEach(breakType => {
            [1, 2].forEach(breakHalf => {
                const concurrentAssignments = assignments.filter(a => 
                    a.weekDay === weekDay && 
                    a.breakType === breakType && 
                    a.breakHalf === breakHalf
                );
                
                // Check for duplicate teachers in concurrent assignments
                const teacherCounts = {};
                concurrentAssignments.forEach(assignment => {
                    teacherCounts[assignment.teacher_id] = (teacherCounts[assignment.teacher_id] || 0) + 1;
                });
                
                Object.entries(teacherCounts).forEach(([teacherId, count]) => {
                    if (count > 1) {
                        errors.push(`Teacher ${teacherId} is assigned to multiple areas during ${breakType} ${breakHalf} on ${weekDay}`);
                    }
                });
            });
        });
    });
    
    // Check coverage (all areas should be covered for each break type and half)
    weekDays.forEach(weekDay => {
        ['recess', 'lunch'].forEach(breakType => {
            [1, 2].forEach(breakHalf => {
                areas.forEach(area => {
                    const covered = assignments.some(assignment => 
                        assignment.area_id === area.id &&
                        assignment.weekDay === weekDay &&
                        assignment.breakType === breakType &&
                        assignment.breakHalf === breakHalf
                    );
                    
                    if (!covered) {
                        errors.push(`Area ${area.id} not covered on ${weekDay} during ${breakType} ${breakHalf}`);
                    }
                });
            });
        });
    });
    
    if (errors.length > 0) {
        console.warn('Validation errors:', errors);
        return false;
    }
    
    return true;
}


assignButton.addEventListener("click", (event) => {
    event.preventDefault();

    const assignments = createAssignments(teachers, areas, weekDays);

    window.assignmentApi.deleteAll();
    window.assignmentApi.createAssignments(assignments);

    location.reload();
});