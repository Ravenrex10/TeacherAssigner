var dbmanager = require("./dbmanager");
var db = dbmanager.db;

exports.getAreas = () => {
    const qry = "SELECT * FROM areas";
    let stmt = db.prepare(qry);
    let res = stmt.all();
    return res;
}