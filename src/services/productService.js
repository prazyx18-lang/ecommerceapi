const db = require("../config/db");

const getAllProducts = (filters, callback) => {
    let sql = `
        SELECT
            products.id,
            products.name,
            products.description,
            products.price,
            categories.name AS category,
            products.category_id,
            products.stock,
            products.image,
            products.rating,
            products.created_at
        FROM products
        JOIN categories
            ON products.category_id = categories.id
        WHERE 1 = 1
    `;

    const values = [];

    if (filters.search) {
        sql += ` AND products.name LIKE ?`;
        values.push(`%${filters.search}%`);
    }

    if (filters.category_id) {
        sql += ` AND products.category_id = ?`;
        values.push(filters.category_id);
    }

    if (filters.min_price) {
        sql += ` AND products.price >= ?`;
        values.push(filters.min_price);
    }

    if (filters.max_price) {
        sql += ` AND products.price <= ?`;
        values.push(filters.max_price);
    }

    if (filters.sort === "price_asc") {
        sql += ` ORDER BY products.price ASC`;
    } else if (filters.sort === "price_desc") {
        sql += ` ORDER BY products.price DESC`;
    } else {
        sql += ` ORDER BY products.id DESC`;
    }

    sql += ` LIMIT ? OFFSET ?`;

    values.push(filters.limit, filters.offset);

    db.query(sql, values, callback);
};

const createProduct = (product, callback) => {
    const sql = `
        INSERT INTO products
        (name, description, price, category_id, stock, image)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        product.name,
        product.description,
        product.price,
        product.category_id,
        product.stock,
        product.image
    ];

    db.query(sql, values, callback);
};
const updateProduct = (id, product, callback) => {
    const sql = `
        UPDATE products
        SET name = ?,
            description = ?,
            price = ?,
            category_id = ?,
            stock = ?,
            image = ?
        WHERE id = ?
    `;

    const values = [
        product.name,
        product.description,
        product.price,
        product.category_id,
        product.stock,
        product.image,
        id
    ];

    db.query(sql, values, callback);
};
const deleteProduct = (id, callback) => {
    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], callback);
};

const getProductById = (id, callback) => {
    const sql = `
        SELECT
            products.id,
            products.name,
            products.description,
            products.price,
            categories.name AS category,
            products.category_id,
            products.stock,
            products.image,
            products.created_at
        FROM products
        JOIN categories
            ON products.category_id = categories.id
        WHERE products.id = ?
    `;

    db.query(sql, [id], callback);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
