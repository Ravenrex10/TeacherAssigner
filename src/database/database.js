const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'yardDuty.db'), (err) => {
    if (err) {
        console.error("Could not open database", err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tables (if not exists)
function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS Teachers (
            teacher_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS Locations (
            location_id INTEGER PRIMARY KEY AUTOINCREMENT,
            location_name TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS YardDutySchedule (
            schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
            teacher_id INTEGER,
            date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            location_id INTEGER,
            notes TEXT,
            FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id),
            FOREIGN KEY (location_id) REFERENCES Locations(location_id)
        )`);
    });
}

// Add a function to add a teacher
function addTeacher(firstName, lastName) {
    const stmt = db.prepare(`INSERT INTO Teachers (first_name, last_name) VALUES (?, ?)`);
    stmt.run(firstName, lastName, function(err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`A new teacher has been added with ID ${this.lastID}`);
        }
    });
    stmt.finalize();
}

function getTeachers() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Teachers', [], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);  // Reject the promise on error
            } else {
                console.log('Showing all teachers');
                resolve(rows);  // Resolve the promise with the retrieved rows
            }
        });
    });
}

module.exports = {
    initializeDatabase,
    addTeacher,
    getTeachers
};
