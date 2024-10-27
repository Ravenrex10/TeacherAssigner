var dbmanager = require("./dbmanager");
var db = dbmanager.db;

exports.getNames = () => {
    const qry = "SELECT * FROM teachers";
    let stmt = db.prepare(qry);
    let res = stmt.all();
    return res;
}

exports.addTeacher = (firstName, lastName) => {
    const qry = 'INSERT INTO teachers (firstName, lastName) VALUES (?, ?)';
    let stmt = db.prepare(qry);
    stmt.run(firstName, lastName);
}