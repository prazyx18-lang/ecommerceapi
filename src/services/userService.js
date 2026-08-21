const db = require("../config/db");

const syncUser = (user, callback) => {

    const sql = `
        INSERT INTO users
        (auth0_id, name, email, phone)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            email = VALUES(email),
            phone = VALUES(phone)
    `;

    const values = [
        user.auth0_id,
        user.name,
        user.email,
        user.phone || null
    ];

    db.query(sql, values, callback);
};


const getAllUsers = (callback) => {

    const sql = `
        SELECT
            id,
            auth0_id,
            name,
            email,
            phone,
            created_at
        FROM users
    `;

    db.query(sql, callback);
};


module.exports = {
    syncUser,
    getAllUsers
};