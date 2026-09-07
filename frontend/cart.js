const API_URL = "https://ecommerceapi-k1fb.onrender.com";


// ========================================
// LOAD CART
// ========================================

async function loadCart() {

    try {

        console.log("Loading cart...");


        // Wait for Auth0
        if (!window.auth0Client) {

            console.log(
                "Auth0 not ready. Waiting..."
            );

            return;

        }


        const isAuthenticated =
            await window.auth0Client.isAuthenticated();


        console.log(
            "Cart page authenticated:",
            isAuthenticated
        );


        if (!isAuthenticated) {

            console.log(
                "User is not logged in"
            );

            showLoginMessage();

            return;

        }


        // ========================================
        // GET ACCESS TOKEN
        // ========================================

        const token =
            await window.auth0Client.getTokenSilently();


        console.log(
            "Access token received"
        );


        // ========================================
        // GET CART FROM MYSQL
        // ========================================

        const response =
            await fetch(
                `${API_URL}/cart`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "MYSQL CART:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load cart"
            );

        }


        // ========================================
        // DISPLAY CART
        // ========================================

        displayCart(data);

        updateCartSummary(data);

        updateCartCount(data);

    }

    catch (error) {

        console.error(
            "LOAD CART ERROR:",
            error
        );

    }

}


// ========================================
// LOGIN MESSAGE
// ========================================

function showLoginMessage() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = `

        <div class="login-required">

            <h2>Please Login</h2>

            <p>
                Please login to view your cart.
            </p>

            <a href="login.html">
                Login
            </a>

        </div>

    `;

}


// ========================================
// DISPLAY CART
// ========================================

function displayCart(cart) {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    if (!cartItems) {
        return;
    }


    if (!cart || cart.length === 0) {

        cartItems.innerHTML = `

            <p>
                Your cart is empty.
            </p>

        `;

        return;

    }


    cartItems.innerHTML =
        cart.map(item => {

            const image =
                item.image
                    ? `./${item.image}`
                    : "./images/no-image.jpg";


            return `

                <div class="cart-item">

                    <img
                        src="${image}"
                        alt="${item.name}"
                    >


                    <div class="cart-item-info">

                        <h3>
                            ${item.name}
                        </h3>


                        <p>
                            Price:
                            ₹${Number(
                                item.price
                            ).toFixed(2)}
                        </p>


                        <p>
                            Quantity:
                            ${item.quantity}
                        </p>


                        <p>

                            Total:

                            ₹${(
                                Number(item.price) *
                                Number(item.quantity)
                            ).toFixed(2)}

                        </p>


                        <button
                            onclick="
                                removeFromCart(
                                    ${item.product_id}
                                )
                            "
                        >

                            Remove

                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


// ========================================
// CART SUMMARY
// ========================================

function updateCartSummary(cart) {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.quantity),
            0
        );


    const totalPrice =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                Number(item.quantity),
            0
        );


    const totalItemsElement =
        document.getElementById(
            "totalItems"
        );


    const totalPriceElement =
        document.getElementById(
            "totalPrice"
        );


    if (totalItemsElement) {

        totalItemsElement.textContent =
            totalItems;

    }


    if (totalPriceElement) {

        totalPriceElement.textContent =
            totalPrice.toFixed(2);

    }

}


// ========================================
// CART COUNT
// ========================================

function updateCartCount(cart) {

    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (!cartCount) {
        return;
    }


    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.quantity),
            0
        );


    cartCount.textContent =
        totalQuantity;

}


// ========================================
// REMOVE FROM CART
// ========================================

async function removeFromCart(productId) {

    try {

        console.log(
            "Removing product:",
            productId
        );


        if (!window.auth0Client) {

            console.error(
                "Auth0 client is not ready"
            );

            return;

        }


        const token =
            await window.auth0Client
                .getTokenSilently();


        const response =
            await fetch(
                `${API_URL}/cart/${productId}`,
                {
                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "REMOVE CART:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to remove product"
            );

        }


        // Reload cart from MySQL
        await loadCart();

    }

    catch (error) {

        console.error(
            "REMOVE CART ERROR:",
            error
        );

    }

}


// ========================================
// WAIT FOR AUTH0
// ========================================

window.addEventListener(
    "auth0Ready",
    function () {

        console.log(
            "Auth0 ready event received"
        );

        loadCart();

    }
);
async function placeOrder() {

    try {

        // ===============================
        // CHECK AUTH0
        // ===============================

        if (!window.auth0Client) {

            console.log(
                "Auth0 is not ready"
            );

            return;
        }


        const isAuthenticated =
            await window.auth0Client.isAuthenticated();


        if (!isAuthenticated) {

            window.location.href =
                "login.html";

            return;
        }


        // ===============================
        // GET TOKEN
        // ===============================

        const token =
            await window.auth0Client.getTokenSilently();


        console.log(
            "ORDER TOKEN RECEIVED:",
            !!token
        );


        // ===============================
        // PLACE ORDER
        // ===============================

        const response =
            await fetch(
                `${API_URL}/orders`,
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "PLACE ORDER RESPONSE:",
            data
        );


        // ===============================
        // CHECK RESPONSE
        // ===============================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to place order"
            );

        }


        // ===============================
        // ORDER SUCCESS
        // ===============================

        console.log(
            "ORDER PLACED:",
            data.order_id
        );


        // Go to orders page

        window.location.href =
            "orders.html";


    } catch (error) {

        console.error(
            "PLACE ORDER ERROR:",
            error
        );

    }

}