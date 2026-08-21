const db = require("../config/db");

const getAllCategories = (callback) => {
    const sql = "SELECT * FROM categories";

    db.query(sql, callback);
};

module.exports = {
    getAllCategories
};