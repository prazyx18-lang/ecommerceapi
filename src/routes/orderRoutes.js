const express = require("express");

const router = express.Router();

const orderController =
    require("../controllers/orderController");

const auth0Middleware =
    require("../middleware/auth0Middleware");


// ===============================
// PLACE ORDER
// ===============================

router.post(
    "/",
    auth0Middleware,
    orderController.placeOrder
);


// ===============================
// GET ORDERS
// ===============================

router.get(
    "/",
    auth0Middleware,
    orderController.getOrders
);


// ===============================
// DELETE ORDER
// ===============================

router.delete(
    "/:id",
    auth0Middleware,
    orderController.deleteOrder
);


module.exports = router;