const validateProduct = (req, res, next) => {
    const { name, price, category_id, stock } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({
            message: "Product name is required"
        });
    }

    if (price === undefined || price <= 0) {
        return res.status(400).json({
            message: "Price must be greater than 0"
        });
    }

    if (!category_id) {
    return res.status(400).json({
        message: "Category is required"
    });
}

    if (stock === undefined || stock < 0) {
        return res.status(400).json({
            message: "Stock cannot be negative"
        });
    }

    next();
};

module.exports = validateProduct;