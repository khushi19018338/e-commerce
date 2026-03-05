const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");

router.post("/", authMiddleware, cartController.addToCart);
router.get("/", authMiddleware, cartController.getCart);
router.delete("/:productId", authMiddleware, cartController.removeFromCart);

module.exports = router;
