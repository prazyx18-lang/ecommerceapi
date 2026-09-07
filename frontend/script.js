const API_URL = "https://ecommerceapi-k1fb.onrender.com";
let allProducts = [];
let allCategories = [];


// ===============================
// GET PRODUCTS
// ===============================

async function loadProducts() {

    try {

        const response =
    await fetch(`${API_URL}/products`);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        allProducts = data.products || [];

        displayProducts(allProducts);

    } catch (error) {

        console.error("Product error:", error);

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
                        alt="${product.name || "Product"}"
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
// GET CATEGORIES
// ===============================

async function loadCategories() {

    try {

        const response =
            await fetch(`${API_URL}/categories`);

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const data =
            await response.json();

        allCategories =
            Array.isArray(data)
                ? data
                : data.categories || [];

        displayCategories(allCategories);

    } catch (error) {

        console.error(
            "Category error:",
            error
        );

        const categoryList =
            document.getElementById("categoryList");

        if (categoryList) {

            categoryList.innerHTML = `
                <p>Unable to load categories.</p>
            `;
        }
    }
}


// ===============================
// DISPLAY CATEGORIES
// ===============================

function displayCategories(categories) {

    const categoryList =
        document.getElementById("categoryList");

    const categoryCards =
        document.getElementById("categoryCards");


    const categoryHTML =
        categories.map(category => {

            return `

                <div
                    class="category"
                    onclick="filterProducts(${category.id})"
                >

                    ${category.name}

                </div>

            `;

        }).join("");


    if (categoryList) {

        categoryList.innerHTML =
            categoryHTML;
    }


    if (categoryCards) {

        categoryCards.innerHTML =
            categoryHTML;
    }
}

// ===============================
// SEARCH PRODUCTS
// ===============================

function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!searchText) {

        displayProducts(allProducts);

        return;
    }


    const filteredProducts =
        allProducts.filter(product => {

            const name =
                (product.name || "")
                    .toLowerCase();

            const description =
                (product.description || "")
                    .toLowerCase();

            const category =
                (product.category || "")
                    .toLowerCase();


            return (
                name.includes(searchText) ||
                description.includes(searchText) ||
                category.includes(searchText)
            );

        });


    displayProducts(filteredProducts);


    document
        .getElementById("products")
        ?.scrollIntoView({
            behavior: "smooth"
        });
}


// ===============================
// CATEGORY FILTER
// ===============================
async function filterProducts(categoryId) {

    try {

        const response = await fetch(
            `${API_URL}/products?category_id=${categoryId}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        console.log("Category ID:", categoryId);
        console.log("Products:", data.products);

        displayProducts(data.products || []);

        document
            .getElementById("products")
            ?.scrollIntoView({
                behavior: "smooth"
            });

    } catch (error) {

        console.error(
            "Category filter error:",
            error
        );
    }
}
// ===============================
// ADD TO CART
// ===============================

async function addToCart(productId) {

    const product = allProducts.find(
        item => Number(item.id) === Number(productId)
    );

    if (!product) {
        console.log("Product not found:", productId);
        return;
    }


    try {

        // Get Auth0 client
        const token =
            await auth0Client.getTokenSilently();


        const response = await fetch(
             "https://ecommerceapi-k1fb.onrender.com/cart",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    product_id: product.id,
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


        updateCartCount();

        window.location.href =
            "cart.html";


    } catch (error) {

        console.error(
            "ADD TO CART ERROR:",
            error
        );

        alert(
            "Please login before adding products to cart."
        );

    }

}
// ===============================
// CART COUNT
// ===============================

async function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }


    try {

        // Make sure Auth0 is initialized
        if (!window.auth0Client) {

            cartCount.textContent = "0";

            return;
        }


        const isAuthenticated =
            await window.auth0Client.isAuthenticated();


        if (!isAuthenticated) {

            cartCount.textContent = "0";

            return;
        }


        // Get Auth0 access token
        const token =
            await window.auth0Client.getTokenSilently();


        // Get cart from MySQL
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


        if (!response.ok) {

            throw new Error(
                "Failed to load cart"
            );

        }


        const cart =
            await response.json();


        console.log(
            "HOME MYSQL CART:",
            cart
        );


        // Calculate total quantity
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
            "HOME CART COUNT ERROR:",
            error
        );

        cartCount.textContent = "0";

    }

}



// ===============================
// LOAD CART COUNT
// ===============================

window.addEventListener(
    "auth0Ready",
    updateCartCount
);


// ===============================
// INITIAL LOAD
// ===============================

loadProducts();
loadCategories();

// ===============================
// AUTH0 LOGOUT
// ===============================

async function logout() {

    try {

        await auth0Client.logout({

            logoutParams: {

                returnTo:
                    "http://127.0.0.1:5500/frontend/login.html"

            }

        });

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}


const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}
