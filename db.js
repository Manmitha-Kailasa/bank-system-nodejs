const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bank.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS loans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        principal REAL,
        interest_rate REAL,
        years INTEGER,
        total_amount REAL,
        emi_amount REAL,
        remaining_amount REAL,
        remaining_emis INTEGER,
        FOREIGN KEY(customer_id) REFERENCES customers(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loan_id INTEGER,
        amount REAL,
        payment_type TEXT,
        date TEXT,
        FOREIGN KEY(loan_id) REFERENCES loans(id)
    )`);
});

module.exports = db;
