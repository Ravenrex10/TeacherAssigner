var dbmanager = require("./dbmanager");
var db = dbmanager.db;

exports.getAssignments = () => {
    const qry = "SELECT * FROM assignments";
    let stmt = db.prepare(qry);
    let res = stmt.all();
    return res;
}

exports.deleteAll = () => {
    const qry = 'DELETE FROM assignments;';
    let stmt = db.prepare(qry);
    stmt.run();
}

exports.createAssignments = (assignments) => {
    const qry = 'INSERT INTO assignments (teacher_id, area_id, weekDay, breakType, breakHalf) VALUES (?, ?, ?, ?, ?)';
    const stmt = db.prepare(qry);

    // Use a transaction to execute all insertions in a single batch
    db.transaction(() => {
        assignments.forEach(assignment => {
            stmt.run(assignment.teacher_id, assignment.area_id, assignment.weekDay, assignment.breakType, assignment.breakHalf);
        });
    })();
}

exports.swapAssignments = (assignmentA, assignmentB) => {
    const deleteQry = 'DELETE FROM assignments WHERE teacher_id = ? AND area_id = ? AND weekDay = ? AND breakType = ? AND breakHalf = ?';
    const insertQry = 'INSERT INTO assignments (teacher_id, area_id, weekDay, breakType, breakHalf) VALUES (?, ?, ?, ?, ?)';
    
    const deleteStmt = db.prepare(deleteQry);
    const insertStmt = db.prepare(insertQry);

    // Use a transaction to ensure atomicity
    db.transaction(() => {
        // Remove the original assignments
        deleteStmt.run(assignmentA.teacher_id, assignmentA.area_id, assignmentA.weekDay, assignmentA.breakType, assignmentA.breakHalf);
        deleteStmt.run(assignmentB.teacher_id, assignmentB.area_id, assignmentB.weekDay, assignmentB.breakType, assignmentB.breakHalf);

        insertStmt.run(
            assignmentA.teacher_id,
            assignmentB.area_id,
            assignmentB.weekDay,
            assignmentB.breakType,
            assignmentB.breakHalf
        );

        insertStmt.run(
            assignmentB.teacher_id,
            assignmentA.area_id,
            assignmentA.weekDay,
            assignmentA.breakType,
            assignmentA.breakHalf
        );

    })();
};

exports.updateAssignment = (teacherId, areaId, weekDay, breakType, breakHalf) => {
    const deleteQry = `
        DELETE FROM assignments 
        WHERE area_id = ? AND weekDay = ? AND breakType = ? AND breakHalf = ?`;
    
    const insertQry = `
        INSERT INTO assignments (teacher_id, area_id, weekDay, breakType, breakHalf) 
        VALUES (?, ?, ?, ?, ?)`;
        exports.updateAssignment = (teacherId, areaId, weekDay, breakType, breakHalf) => {
            const deleteQry = `
                DELETE FROM assignments 
                WHERE area_id = ? AND weekDay = ? AND breakType = ? AND breakHalf = ?`;
            
            const insertQry = `
                INSERT INTO assignments (teacher_id, area_id, weekDay, breakType, breakHalf) 
                VALUES (?, ?, ?, ?, ?)`;
        
            const deleteStmt = db.prepare(deleteQry);
            const insertStmt = db.prepare(insertQry);
        
            try {
                db.transaction(() => {
                    // Step 1: Remove existing assignment for this slot
                    deleteStmt.run(areaId, weekDay, breakType, breakHalf);
        
                    // Step 2: Add new assignment if a teacher is provided
                    if (teacherId) {   
                        insertStmt.run(teacherId, areaId, weekDay, breakType, breakHalf);
                    }
                })();
            } catch (error) {
                console.error("Error in updateAssignment:", error);
            }
        };
        
    const deleteStmt = db.prepare(deleteQry);
    const insertStmt = db.prepare(insertQry);

    try {
        db.transaction(() => {
            // Step 1: Remove existing assignment for this slot
            console.log("Deleting existing assignment for:", { areaId, weekDay, breakType, breakHalf });
            deleteStmt.run(areaId, weekDay, breakType, breakHalf);

            // Step 2: Add new assignment if a teacher is provided
            if (teacherId) {
                console.log("Inserting new assignment:", { teacherId, areaId, weekDay, breakType, breakHalf });
                insertStmt.run(teacherId, areaId, weekDay, breakType, breakHalf);
            } else {
                console.log("No teacher selected. Assignment cleared for this slot.");
            }
        })();
    } catch (error) {
        console.error("Error in updateAssignment:", error);
    }
};
