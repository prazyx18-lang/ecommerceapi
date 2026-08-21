const express = require("express");

const router = express.Router();

const userController =
    require("../controllers/userController");

    console.log("USER CONTROLLER:", userController);

const auth0Middleware =
    require("../middleware/auth0Middleware");


router.get(
    "/",
    auth0Middleware,
    userController.getUsers
);


router.post(
    "/sync",
    auth0Middleware,
    userController.syncUser
);


module.exports = router;