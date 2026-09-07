window.auth0Client = null;


// ===============================
// INITIALIZE AUTH0
// ===============================

async function initAuth0() {

    console.log("Initializing Auth0...");


    try {

        window.auth0Client =
            await auth0.createAuth0Client({

                domain:
                    "dev-1p1pnj4cvotiwki2.us.auth0.com",

                clientId:
                    "dyz1cLmqOJJrMpc0jQEB82gxFIAnyD0l",

                cacheLocation:
                    "localstorage",

                authorizationParams: {

                    audience:
                        "https://shopeasy-api",

                    redirect_uri:
                        "http://127.0.0.1:5500/frontend/login.html"

                }

            });


        console.log(
            "Auth0 client created"
        );


        // ===============================
        // CHECK LOGIN
        // ===============================

        const isAuthenticated =
            await window.auth0Client.isAuthenticated();


        console.log(
            "IS AUTHENTICATED:",
            isAuthenticated
        );


        const loginLink =
            document.getElementById("loginLink");


        const logoutButton =
            document.getElementById("logoutButton");


        // ===============================
        // USER LOGGED IN
        // ===============================

        if (isAuthenticated) {

            console.log(
                "USER IS LOGGED IN"
            );


            // ===============================
            // GET AUTH0 USER
            // ===============================

            const user =
                await window.auth0Client.getUser();


            console.log(
                "AUTH0 USER:",
                user
            );


            // ===============================
            // SYNC USER TO DATABASE
            // ===============================

            try {

                const token =
                    await window.auth0Client
                        .getTokenSilently();


                const response =
                    await fetch(
                        "https://ecommerceapi-k1fb.onrender.com/users/sync",
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    name:
                                        user.name ||
                                        user.nickname ||
                                        "User",

                                    email:
                                        user.email,

                                    phone:
                                        user.phone_number ||
                                        null

                                })

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "DATABASE SYNC:",
                    data
                );


                if (!response.ok) {

                    console.error(
                        "DATABASE SYNC FAILED:",
                        data
                    );

                }

            } catch (error) {

                console.error(
                    "DATABASE SYNC ERROR:",
                    error
                );

            }


            // ===============================
            // HIDE LOGIN
            // ===============================

            if (loginLink) {

                loginLink.style.display =
                    "none";

            }


            // ===============================
            // SHOW LOGOUT
            // ===============================

            if (logoutButton) {

                logoutButton.style.display =
                    "inline-block";

            }


        } else {

            // ===============================
            // USER NOT LOGGED IN
            // ===============================

            console.log(
                "USER IS NOT LOGGED IN"
            );


            if (loginLink) {

                loginLink.style.display =
                    "inline-block";

            }


            if (logoutButton) {

                logoutButton.style.display =
                    "none";

            }

        }


        // ===============================
        // LOGOUT
        // ===============================

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async function () {

                    console.log(
                        "LOGOUT CLICKED"
                    );


                    await window.auth0Client.logout({

                        logoutParams: {

                            returnTo:
                                "http://127.0.0.1:5500/frontend/login.html"

                        }

                    });

                }
            );

        }


        // ===============================
        // AUTH0 READY
        // ===============================

        console.log(
            "AUTH0 FULLY READY"
        );


        window.dispatchEvent(
            new Event("auth0Ready")
        );


    } catch (error) {

        console.error(
            "AUTH0 INITIALIZATION ERROR:",
            error
        );

    }

}
// ======================================
// START CART AFTER AUTH0 IS READY
// ======================================

async function startCart() {

    console.log("Starting cart...");

    if (!window.auth0Client) {

        console.log(
            "Auth0 client is not ready"
        );

        return;
    }

    await loadCart();
}


// ======================================
// AUTH0 READY EVENT
// ======================================

window.addEventListener(
    "auth0Ready",
    function () {

        console.log(
            "AUTH0 READY RECEIVED IN CART"
        );

        startCart();

    }
);


// ======================================
// SAFETY CHECK
// ======================================

setTimeout(
    startCart,
    1000
);

// ===============================
// START AUTH0
// ===============================

initAuth0();
async function loadCart() {

    try {

        console.log("Loading cart...");

        if (!window.auth0Client) {

            console.log(
                "Auth0 client not available"
            );

            return;
        }

        const isAuthenticated =
            await window.auth0Client
                .isAuthenticated();

        console.log(
            "CART AUTHENTICATED:",
            isAuthenticated
        );

        if (!isAuthenticated) {

            document.getElementById(
                "cartItems"
            ).innerHTML = `
                <p>Please login to view your cart.</p>
            `;

            return;
        }

        const token =
            await window.auth0Client
                .getTokenSilently();

        console.log(
            "TOKEN RECEIVED FOR CART"
        );

        const response =
            await fetch(
                "https://ecommerceapi-k1fb.onrender.com/cart",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const cart =
            await response.json();

        console.log(
            "DATABASE CART:",
            cart
        );

        if (!response.ok) {

            throw new Error(
                cart.message ||
                "Failed to load cart"
            );
        }

        displayCart(cart);

        updateCartSummary(cart);

        updateCartCount(cart);

    } catch (error) {

        console.error(
            "LOAD CART ERROR:",
            error
        );

    }
}