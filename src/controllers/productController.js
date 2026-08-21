const productService = require("../services/productService");

const getProducts = (req, res) => {
    const search = req.query.search || "";
    const category_id = req.query.category_id || "";

    const min_price = req.query.min_price || "";
    const max_price = req.query.max_price || "";

    const sort = req.query.sort || "";

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    const filters = {
        search,
        category_id,
        min_price,
        max_price,
        sort,
        limit,
        offset
    };

    productService.getAllProducts(filters, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch products",
                error: err.message
            });
        }

        res.json({
            page,
            limit,
            products: results
        });
    });
};

const createProduct = (req, res) => {
    const product = req.body;

    productService.createProduct(product, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to create product",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Product created successfully",
            productId: result.insertId
        });
    });
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const product = req.body;

    productService.updateProduct(id, product, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to update product",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product updated successfully"
        });
    });
};

const deleteProduct = (req, res) => {
    const { id } = req.params;

    productService.deleteProduct(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to delete product",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    });
};

const getProductById = (req, res) => {
    const { id } = req.params;

    productService.getProductById(id, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch product",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(results[0]);
    });
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};