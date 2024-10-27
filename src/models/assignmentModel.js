var dbmanager = require("./dbmanager");
var db = dbmanager.db;

exports.getAssignments = () => {
    const qry = "SELECT * FROM assignments";
    let stmt = db.prepare(qry);
    let res = stmt.all();
    return res;
}