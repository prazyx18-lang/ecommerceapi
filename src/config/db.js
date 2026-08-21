const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "praveen@123",
    database: "ecommerce_db"
});

db.getConnection((err, connection) => {
    if (err) {
        console.log("Database connection failed:", err.message);
        return;
    }

    console.log("MySQL database connected");
    connection.release();
});

module.exports = db;