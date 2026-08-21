const categoryService = require("../services/categoryService");

const getCategories = (req, res) => {
    categoryService.getAllCategories((err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch categories",
                error: err.message
            });
        }

        res.json(results);
    });
};

module.exports = {
    getCategories
};