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
    const qry = 'INSERT INTO assignments (teacher_id, area_id, weekDay) VALUES (?, ?, ?)';
    const stmt = db.prepare(qry);

    // Use a transaction to execute all insertions in a single batch
    db.transaction(() => {
        assignments.forEach(assignment => {
            stmt.run(assignment.teacher_id, assignment.area_id, assignment.weekDay);
        });
    })();
}