const cartService = require("../services/cartService");


// ===============================
// ADD TO CART
// ===============================

const addToCart = async (req, res) => {

    try {

        const auth0Id =
            req.auth.payload.sub;

        const {
            product_id,
            quantity
        } = req.body;


        console.log("AUTH0 ID:", auth0Id);
        console.log("CART BODY:", req.body);


        if (!product_id || !quantity) {

            return res.status(400).json({
                message:
                    "Product ID and quantity are required"
            });

        }


        if (quantity <= 0) {

            return res.status(400).json({
                message:
                    "Quantity must be greater than 0"
            });

        }


        const userId =
            await cartService.getUserIdByAuth0Id(
                auth0Id
            );


        console.log(
            "MYSQL USER ID:",
            userId
        );


        if (!userId) {

            return res.status(404).json({
                message:
                    "User not found in database"
            });

        }


        cartService.addToCart(
            userId,
            product_id,
            quantity,
            (err, result) => {

                if (err) {

                    console.error(
                        "ADD TO CART DB ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to add product to cart",
                        error:
                            err.message
                    });

                }


                res.status(201).json({
                    message:
                        "Product added to cart successfully"
                });

            }
        );

    } catch (error) {

        console.error(
            "CART ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to add product to cart",
            error:
                error.message
        });

    }

};


// ===============================
// GET CART
// ===============================

const getCart = async (req, res) => {

    try {

        const auth0Id =
            req.auth.payload.sub;


        console.log(
            "GET CART AUTH0 ID:",
            auth0Id
        );


        const userId =
            await cartService.getUserIdByAuth0Id(
                auth0Id
            );


        console.log(
            "GET CART MYSQL USER ID:",
            userId
        );


        if (!userId) {

            return res.status(404).json({
                message:
                    "User not found in database"
            });

        }


        cartService.getCart(
            userId,
            (err, results) => {

                if (err) {

                    console.error(
                        "GET CART DB ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to load cart",
                        error:
                            err.message
                    });

                }


                console.log(
                    "MYSQL CART:",
                    results
                );


                res.status(200).json(
                    results
                );

            }
        );

    } catch (error) {

        console.error(
            "GET CART ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to load cart",
            error:
                error.message
        });

    }

};

const removeFromCart = async (req, res) => {

    try {

        const auth0Id =
            req.auth.payload.sub;

        const productId =
            req.params.productId;


        const userId =
            await cartService.getUserIdByAuth0Id(
                auth0Id
            );


        if (!userId) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        cartService.removeFromCart(
            userId,
            productId,
            (err, result) => {

                if (err) {

                    console.error(
                        "REMOVE CART ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to remove product"
                    });

                }


                res.json({
                    message:
                        "Product removed from cart"
                });

            }
        );

    } catch (error) {

        console.error(
            "REMOVE CART ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to remove product",
            error:
                error.message
        });

    }

};


// ===============================
// EXPORT
// ===============================

module.exports = {
    addToCart,
    getCart,
    removeFromCart
};