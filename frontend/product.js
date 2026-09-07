const API_URL = "https://ecommerceapi-k1fb.onrender.com";


// ===============================
// LOAD PRODUCT
// ===============================

async function loadProduct() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    console.log(
        "PRODUCT ID:",
        productId
    );


    if (!productId) {

        document.getElementById(
            "productDetails"
        ).innerHTML = `
            <p>Product not found.</p>
        `;

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/products/${productId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load product"
            );

        }


        const data =
            await response.json();


        console.log(
            "PRODUCT:",
            data
        );


        // Your API may return
        // { product: {...} }

        const product =
            data.product || data;


        displayProduct(product);


    } catch (error) {

        console.error(
            "PRODUCT ERROR:",
            error
        );


        document.getElementById(
            "productDetails"
        ).innerHTML = `
            <p>
                Unable to load product.
            </p>
        `;

    }

}


// ===============================
// DISPLAY PRODUCT
// ===============================

function displayProduct(product) {

    const productDetails =
        document.getElementById(
            "productDetails"
        );


    if (!productDetails) {
        return;
    }


    const image =
        product.image
            ? `./${product.image}`
            : "./images/no-image.jpg";


    productDetails.innerHTML = `

        <div class="product-detail-container">

            <div class="product-detail-image">

                <img
                    src="${image}"
                    alt="${product.name}"
                >

            </div>


            <div class="product-detail-info">

                <h1>
                    ${product.name}
                </h1>


                <p class="product-description">

                    ${
                        product.description ||
                        "No description available"
                    }

                </p>


                <h2 class="product-price">

                    ₹${Number(
                        product.price
                    ).toFixed(2)}

                </h2>


                <p>

                    <strong>
                        Category:
                    </strong>

                    ${product.category || "N/A"}

                </p>


                <p>

                    <strong>
                        Stock:
                    </strong>

                    ${product.stock ?? 0}

                </p>


                <button
                    class="add-cart"
                    onclick="addToCart(${product.id})"
                >

                    🛒 Add to Cart

                </button>


                <br><br>


                <a href="products.html">

                    ← Back to Products

                </a>

            </div>

        </div>

    `;

}


// ===============================
// ADD TO CART
// ===============================

async function addToCart(productId) {

    console.log(
        "ADD TO CART PRODUCT ID:",
        productId
    );

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


        console.log(
            "PRODUCT PAGE AUTH:",
            isAuthenticated
        );


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
            "TOKEN RECEIVED:",
            !!token
        );


        // ===============================
        // ADD TO MYSQL CART
        // ===============================

        const response =
            await fetch(
                `${API_URL}/cart`,
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

                            product_id:
                                Number(productId),

                            quantity: 1

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "ADD CART RESPONSE:",
            data
        );


        // ===============================
        // CHECK RESPONSE
        // ===============================

        if (!response.ok) {

            console.error(
                "ADD CART FAILED:",
                data
            );

            return;
        }


        // ===============================
        // SUCCESS
        // ===============================

        console.log(
            "PRODUCT ADDED SUCCESSFULLY"
        );


        // Go directly to cart
        window.location.href =
            "cart.html";


    } catch (error) {

        console.error(
            "ADD TO CART ERROR:",
            error
        );

    }

}

// ===============================
// CART COUNT
// ===============================

async function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (!cartCount) {
        return;
    }


    try {

        if (!window.auth0Client) {

            return;
        }


        const isAuthenticated =
            await window.auth0Client
                .isAuthenticated();


        if (!isAuthenticated) {

            cartCount.textContent = "0";

            return;
        }


        const token =
            await window.auth0Client
                .getTokenSilently();


        const response =
            await fetch(
                `${API_URL}/cart`,
                {
                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const cart =
            await response.json();


        console.log(
            "PRODUCT PAGE CART:",
            cart
        );


        if (!response.ok) {

            throw new Error(
                cart.message ||
                "Failed to load cart"
            );

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


    } catch (error) {

        console.error(
            "PRODUCT CART COUNT ERROR:",
            error
        );

    }

}


// ===============================
// WAIT FOR AUTH0
// ===============================

window.addEventListener(
    "auth0Ready",
    async function () {

        console.log(
            "Auth0 ready on product page"
        );

        await updateCartCount();

    }
);

// ===============================
// LOAD PRODUCT
// ===============================

loadProduct();