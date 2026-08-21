const userService =
    require("../services/userService");


const syncUser = (req, res) => {

    const {
        name,
        email,
        phone
    } = req.body;


    const auth0_id =
        req.auth.payload.sub;


    if (!auth0_id || !name || !email) {

        return res.status(400).json({
            message:
                "Auth0 user information is missing"
        });

    }


    const user = {
        auth0_id,
        name,
        email,
        phone
    };


    userService.syncUser(
        user,
        (err, result) => {

            if (err) {

                console.error(
                    "USER SYNC ERROR:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to sync user",
                    error:
                        err.message
                });

            }


            res.status(200).json({
                message:
                    "User synchronized successfully"
            });

        }
    );

};


const getUsers = (req, res) => {

    userService.getAllUsers(
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    message:
                        "Failed to fetch users",
                    error:
                        err.message
                });

            }

            res.json(results);

        }
    );

};


module.exports = {
    syncUser,
    getUsers
};