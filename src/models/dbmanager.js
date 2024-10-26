const sqlite = require('better-sqlite3');
const dbPath = path.join(__dirname, './teachers.db');
const db = new sqlite(dbPath);
exports.db = db;