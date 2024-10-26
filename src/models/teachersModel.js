var dbmanager = require("./dbmanager");
var db = dbmanager.db;

exports.getNames = () => {
    const qry = "SELECT * FROM Teachers";
    let stmt = db.prepare(qry);
    let res = stmt.all();
    return res;
}