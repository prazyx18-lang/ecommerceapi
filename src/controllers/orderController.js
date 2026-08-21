const orderService =
    require("../services/orderService");


// ========================================
// PLACE ORDER
// ========================================

const placeOrder = async (req, res) => {

    try {

        // Auth0 user ID
        const auth0Id =
            req.auth.payload.sub;


        console.log(
            "ORDER AUTH0 ID:",
            auth0Id
        );


        // Get user's MySQL ID
        const userId =
            await orderService.getUserIdByAuth0Id(
                auth0Id
            );


        console.log(
            "ORDER MYSQL USER ID:",
            userId
        );


        if (!userId) {

            return res.status(404).json({
                message:
                    "User not found"
            });

        }


        // Create order from MySQL cart
        orderService.placeOrder(
            userId,
            (err, result) => {

                if (err) {

                    console.error(
                        "PLACE ORDER ERROR:",
                        err
                    );

                    return res.status(400).json({
                        message:
                            err.message
                    });

                }


                res.status(201).json({

                    message:
                        "Order placed successfully",

                    order_id:
                        result.orderId

                });

            }
        );

    }

    catch (error) {

        console.error(
            "ORDER ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to place order",

            error:
                error.message

        });

    }

};
const getOrders = async (req, res) => {

    try {

        const auth0Id =
            req.auth.payload.sub;


        const userId =
            await orderService.getUserIdByAuth0Id(
                auth0Id
            );


        if (!userId) {

            return res.status(404).json({
                message:
                    "User not found"
            });

        }


        orderService.getOrdersByUserId(
            userId,
            (err, results) => {

                if (err) {

                    console.error(
                        "GET ORDERS ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to load orders"
                    });

                }


                res.json(results);

            }
        );

    } catch (error) {

        console.error(
            "ORDERS ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to load orders",
            error:
                error.message
        });

    }

};

const deleteOrder = async (req, res) => {

    try {

        const auth0Id =
            req.auth.payload.sub;


        const orderId =
            Number(req.params.id);


        if (!orderId) {

            return res.status(400).json({
                message:
                    "Invalid order ID"
            });

        }


        const userId =
            await orderService.getUserIdByAuth0Id(
                auth0Id
            );


        if (!userId) {

            return res.status(404).json({
                message:
                    "User not found"
            });

        }


        orderService.deleteOrder(
            userId,
            orderId,
            (err) => {

                if (err) {

                    console.error(
                        "DELETE ORDER ERROR:",
                        err
                    );

                    return res.status(400).json({
                        message:
                            err.message
                    });

                }


                res.json({
                    message:
                        "Order deleted successfully"
                });

            }
        );

    } catch (error) {

        console.error(
            "DELETE ORDER ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete order"
        });

    }

};

module.exports = {

    placeOrder,

    getOrders,

    deleteOrder

};