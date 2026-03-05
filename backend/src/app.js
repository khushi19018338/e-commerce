const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const userRoutes = require("./modules/user/user.routes");
const productRoutes = require("./modules/product/product.routes");
const cartRoutes = require("./modules/cart/cart.routes");
const orderRoutes = require("./modules/order/order.routes");
const errorHandler = require("./middleware/error.middleware");

// 🔥 Middleware FIRST
app.use(cors({
  origin: ["https://e-commerce-two-chi-44.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes AFTER
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.send("E-commerce API Running");
});

// Error handler LAST
app.use(errorHandler);

module.exports = app;
