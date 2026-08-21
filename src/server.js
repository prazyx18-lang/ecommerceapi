require("dotenv").config();

console.log("JWT SECRET LOADED:", !!process.env.JWT_SECRET);

const app = require("./app");
const db = require("./config/db");

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});