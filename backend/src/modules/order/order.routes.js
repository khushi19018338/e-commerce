const express = require("express");
const router = express.Router();

const orderController = require("./order.controller");

const {
  authMiddleware,
  authorizeRoles
} = require("../../middleware/auth.middleware");


// 🛒 Create order + Razorpay order
router.post(
  "/",
  authMiddleware,
  orderController.createOrder
);


// 📦 Get logged-in user's orders
router.get(
  "/my-orders",
  authMiddleware,
  orderController.getMyOrders
);


// 👑 Admin - Get all orders
router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  orderController.getAllOrders
);


// 🔐 Razorpay Payment Verification
router.post(
  "/verify",
  authMiddleware,
  orderController.verifyPayment
);


module.exports = router;