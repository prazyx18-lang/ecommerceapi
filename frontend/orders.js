// ===============================
// LOAD ORDERS
// ===============================

function loadOrders() {

    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];

    const ordersList =
        document.getElementById("ordersList");

    if (!ordersList) {
        return;
    }

    if (orders.length === 0) {

        ordersList.innerHTML = `
            <p>
                No orders found.
            </p>
        `;

        return;
    }


    ordersList.innerHTML =
        orders.map((order, index) => {

            return `

                <div class="order-card">

                    <h2>
                        Order #${index + 1}
                    </h2>

                    <p>
                        Status:
                        <strong>Order Placed</strong>
                    </p>


                    <div class="order-products">

                        ${order.items.map(item => `

                            <div class="order-item">

                                <h3>
                                    ${item.name}
                                </h3>

                                <p>
                                    Quantity:
                                    ${item.quantity}
                                </p>

                                <p>
                                    Price:
                                    ₹${Number(item.price).toFixed(2)}
                                </p>

                                <p>
                                    Total:
                                    ₹${(
                                        Number(item.price) *
                                        Number(item.quantity)
                                    ).toFixed(2)}
                                </p>

                            </div>

                        `).join("")}

                    </div>


                    <h3>
                        Order Total:
                        ₹${Number(order.total).toFixed(2)}
                    </h3>

                </div>

            `;

        }).join("");
}


loadOrders();