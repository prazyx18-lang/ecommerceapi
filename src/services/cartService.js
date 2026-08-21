const db = require("../config/db");


const getUserIdByAuth0Id = (auth0Id) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT id
            FROM users
            WHERE auth0_id = ?
        `;

        db.query(
            sql,
            [auth0Id],
            (err, results) => {

                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return resolve(null);
                }

                resolve(results[0].id);

            }
        );

    });

};


const addToCart = (
    userId,
    productId,
    quantity,
    callback
) => {

    const sql = `
        INSERT INTO cart
        (user_id, product_id, quantity)

        VALUES (?, ?, ?)

        ON DUPLICATE KEY UPDATE
        quantity =
            quantity + VALUES(quantity)
    `;

    db.query(
        sql,
        [userId, productId, quantity],
        callback
    );

};
const getCart = (userId, callback) => {

    const sql = `
        SELECT
            cart.id,
            cart.product_id,
            cart.quantity,
            products.name,
            products.price,
            products.image

        FROM cart

        INNER JOIN products
            ON cart.product_id = products.id

        WHERE cart.user_id = ?
    `;


    db.query(
        sql,
        [userId],
        callback
    );

};
const removeFromCart = (userId, productId, callback) => {

    const sql = `
        DELETE FROM cart
        WHERE user_id = ?
        AND product_id = ?
    `;

    db.query(
        sql,
        [userId, productId],
        callback
    );
};


module.exports = {
    getUserIdByAuth0Id,
    addToCart,
    getCart,
    removeFromCart
};
