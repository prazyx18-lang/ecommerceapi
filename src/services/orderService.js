const db = require("../config/db");


// ========================================
// GET MYSQL USER ID
// ========================================

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


// ========================================
// PLACE ORDER
// ========================================

const placeOrder = (
    userId,
    callback
) => {

    // ========================================
    // GET CART
    // ========================================

    const cartSQL = `

        SELECT
            cart.product_id,
            cart.quantity,
            products.price,
            products.stock

        FROM cart

        INNER JOIN products
            ON cart.product_id = products.id

        WHERE cart.user_id = ?

    `;


    db.query(
        cartSQL,
        [userId],
        (err, cartItems) => {

            if (err) {
                return callback(err);
            }


            // ========================================
            // CHECK EMPTY CART
            // ========================================

            if (cartItems.length === 0) {

                return callback(
                    new Error(
                        "Cart is empty"
                    )
                );

            }


            // ========================================
            // CHECK STOCK
            // ========================================

            for (const item of cartItems) {

                if (
                    item.stock < item.quantity
                ) {

                    return callback(
                        new Error(
                            `Insufficient stock for product ${item.product_id}`
                        )
                    );

                }

            }


            // ========================================
            // CALCULATE TOTAL
            // ========================================

            let totalAmount = 0;


            for (const item of cartItems) {

                totalAmount +=
                    Number(item.price) *
                    Number(item.quantity);

            }


            // ========================================
            // CREATE ORDER
            // ========================================

            const orderSQL = `

                INSERT INTO orders
                (
                    user_id,
                    total_amount,
                    status
                )

                VALUES (?, ?, 'Pending')

            `;


            db.query(
                orderSQL,
                [userId, totalAmount],
                (err, orderResult) => {

                    if (err) {
                        return callback(err);
                    }


                    const orderId =
                        orderResult.insertId;


                    // ========================================
                    // CREATE ORDER ITEMS
                    // ========================================

                    let completed = 0;


                    for (const item of cartItems) {

                        const itemSQL = `

                            INSERT INTO order_items
                            (
                                order_id,
                                product_id,
                                quantity,
                                price
                            )

                            VALUES (?, ?, ?, ?)

                        `;


                        db.query(
                            itemSQL,
                            [
                                orderId,
                                item.product_id,
                                item.quantity,
                                item.price
                            ],
                            (err) => {

                                if (err) {
                                    return callback(err);
                                }


                                completed++;


                                // ========================================
                                // ALL ORDER ITEMS CREATED
                                // ========================================

                                if (
                                    completed ===
                                    cartItems.length
                                ) {

                                    updateStockAndClearCart(
                                        userId,
                                        cartItems,
                                        orderId,
                                        callback
                                    );

                                }

                            }
                        );

                    }

                }
            );

        }
    );

};


// ========================================
// UPDATE STOCK + CLEAR CART
// ========================================

const updateStockAndClearCart = (
    userId,
    cartItems,
    orderId,
    callback
) => {

    let completed = 0;


    for (const item of cartItems) {

        const stockSQL = `

            UPDATE products

            SET stock =
                stock - ?

            WHERE id = ?

        `;


        db.query(
            stockSQL,
            [
                item.quantity,
                item.product_id
            ],
            (err) => {

                if (err) {
                    return callback(err);
                }


                completed++;


                if (
                    completed ===
                    cartItems.length
                ) {

                    // ========================================
                    // CLEAR CART
                    // ========================================

                    const deleteSQL = `

                        DELETE FROM cart
                        WHERE user_id = ?

                    `;


                    db.query(
                        deleteSQL,
                        [userId],
                        (err) => {

                            if (err) {
                                return callback(err);
                            }


                            callback(
                                null,
                                {
                                    orderId:
                                        orderId
                                }
                            );

                        }
                    );

                }

            }
        );

    }

};
const getOrdersByUserId = (
    userId,
    callback
) => {

    const sql = `

        SELECT
            orders.id AS order_id,
            orders.total_amount,
            orders.status,
            orders.created_at,
            order_items.product_id,
            order_items.quantity,
            order_items.price,
            products.name,
            products.image

        FROM orders

        INNER JOIN order_items
            ON orders.id = order_items.order_id

        INNER JOIN products
            ON order_items.product_id = products.id

        WHERE orders.user_id = ?

        ORDER BY orders.created_at DESC

    `;


    db.query(
        sql,
        [userId],
        callback
    );

};

const deleteOrder = (
    userId,
    orderId,
    callback
) => {

    // First delete order items
    const deleteItemsSQL = `
        DELETE FROM order_items
        WHERE order_id = ?
    `;

    db.query(
        deleteItemsSQL,
        [orderId],
        (err) => {

            if (err) {
                return callback(err);
            }


            // Then delete the order
            const deleteOrderSQL = `
                DELETE FROM orders
                WHERE id = ?
                AND user_id = ?
            `;

            db.query(
                deleteOrderSQL,
                [orderId, userId],
                (err, result) => {

                    if (err) {
                        return callback(err);
                    }


                    if (result.affectedRows === 0) {

                        return callback(
                            new Error(
                                "Order not found"
                            )
                        );

                    }


                    callback(null);

                }
            );

        }
    );

};

module.exports = {

    getUserIdByAuth0Id,

    placeOrder,

    getOrdersByUserId,

    deleteOrder

};