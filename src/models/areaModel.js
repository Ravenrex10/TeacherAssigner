var dbmanager = require("./dbmanager");
var db = dbmanager.db;

exports.getAreas = () => {
    const qry = "SELECT * FROM areas";
    let stmt = db.prepare(qry);
    let res = stmt.all();
    return res;
}

exports.addArea = (areaName, areaTime) => {
    const qry = 'INSERT INTO areas (areaName, areaTime) VALUES (?, ?)';
    let stmt = db.prepare(qry);
    stmt.run(areaName, areaTime);
}

exports.deleteArea = (areaId) => {
    const qry = 'DELETE FROM areas WHERE id = ?;';
    let stmt = db.prepare(qry);
    stmt.run(areaId);
}