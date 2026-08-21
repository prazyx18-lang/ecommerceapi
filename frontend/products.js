const API_URL = "http://localhost:3000";

let allProducts = [];


// ===============================
// LOAD ALL PRODUCTS
// ===============================

async function loadAllProducts() {

    try {

        const response = await fetch(
            `${API_URL}/products?limit=100`
        );

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const data = await response.json();

        console.log("Products API:", data);

        allProducts = data.products || [];

        displayProducts(allProducts);

    } catch (error) {

        console.error("Products error:", error);

        const productList =
            document.getElementById("productList");

        if (productList) {

            productList.innerHTML = `
                <p>Unable to load products.</p>
            `;

        }

    }

}


// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(products) {

    const productList =
        document.getElementById("productList");

    if (!productList) {
        return;
    }

    if (!products || products.length === 0) {

        productList.innerHTML = `
            <p>No products available.</p>
        `;

        return;
    }


    productList.innerHTML = products.map(product => {

        const image =
            product.image
                ? `./${product.image}`
                : "./images/no-image.jpg";


        return `

            <div class="product-card">

                <a href="product.html?id=${product.id}">

                    <img
                        src="${image}"
                        alt="${product.name}"
                    >

                </a>


                <div class="product-info">

                    <h3>

                        <a
                            href="product.html?id=${product.id}"
                            class="product-link"
                        >
                            ${product.name || "Unnamed Product"}
                        </a>

                    </h3>


                    <p class="product-description">

                        ${
                            product.description ||
                            "No description available"
                        }

                    </p>


                    <p class="product-price">

                        ₹${Number(product.price).toFixed(2)}

                    </p>


                    <p>
                        Category:
                        ${product.category || "N/A"}
                    </p>


                    <p>
                        Stock:
                        ${product.stock}
                    </p>


                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})"
                    >

                        🛒 Add to Cart

                    </button>

                </div>

            </div>

        `;

    }).join("");

}


// ===============================
// ADD TO MYSQL CART
// ===============================

async function addToCart(productId) {

    console.log(
        "ADDING PRODUCT:",
        productId
    );


    try {

        // Check Auth0

        if (!window.auth0Client) {

            alert(
                "Please wait for login to finish."
            );

            return;
        }


        const isAuthenticated =
            await window.auth0Client.isAuthenticated();


        console.log(
            "AUTHENTICATED:",
            isAuthenticated
        );


        if (!isAuthenticated) {

            alert(
                "Please login before adding products to cart."
            );

            return;
        }


        // Get Auth0 token

        const token =
            await window.auth0Client.getTokenSilently();


        console.log(
            "TOKEN RECEIVED"
        );


        // Add to MySQL cart

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
            "ADD TO CART RESPONSE:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to add product to cart"
            );

        }


        // Update cart number

        await updateCartCount();

window.location.href = "cart.html";

    } catch (error) {

        console.error(
            "ADD TO CART ERROR:",
            error
        );


        alert(
            error.message ||
            "Unable to add product to cart."
        );

    }

}


// ===============================
// UPDATE CART COUNT FROM MYSQL
// ===============================

async function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");


    if (!cartCount) {
        return;
    }


    try {

        if (!window.auth0Client) {

            console.log(
                "Auth0 not ready"
            );

            return;
        }


        const isAuthenticated =
            await window.auth0Client.isAuthenticated();


        if (!isAuthenticated) {

            cartCount.textContent = "0";

            return;
        }


        const token =
            await window.auth0Client.getTokenSilently();


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


        const cart =
            await response.json();


        console.log(
            "MYSQL CART:",
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
                (total, item) => {

                    return (
                        total +
                        Number(item.quantity)
                    );

                },
                0
            );


        cartCount.textContent =
            totalQuantity;


    } catch (error) {

        console.error(
            "CART COUNT ERROR:",
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
            "AUTH0 READY"
        );

        await updateCartCount();

    }
);


// ===============================
// FALLBACK
// ===============================

setTimeout(
    async function () {

        await updateCartCount();

    },
    1500
);


// ===============================
// INITIAL LOAD
// ===============================

loadAllProducts();