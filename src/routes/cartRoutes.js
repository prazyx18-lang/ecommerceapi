const express = require("express");

const router = express.Router();

const cartController =
    require("../controllers/cartController");

const auth0Middleware =
    require("../middleware/auth0Middleware");


router.post(
    "/",
    auth0Middleware,
    cartController.addToCart
);


router.get(
    "/",
    auth0Middleware,
    cartController.getCart
);


router.delete(
    "/:productId",
    auth0Middleware,
    cartController.removeFromCart
);


module.exports = router;