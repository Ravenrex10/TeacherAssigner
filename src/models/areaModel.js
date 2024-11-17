var dbmanager = require("./dbmanager");
var db = dbmanager.db;

exports.getAreas = () => {
    const qry = "SELECT * FROM areas";
    let stmt = db.prepare(qry);
    let res = stmt.all();
    return res;
}

exports.addArea = (areaName) => {
    const qry = 'INSERT INTO areas (areaName) VALUES (?)';
    let stmt = db.prepare(qry);
    stmt.run(areaName);
}

exports.deleteArea = (areaId) => {
    const qry = 'DELETE FROM areas WHERE id = ?;';
    let stmt = db.prepare(qry);
    stmt.run(areaId);
}