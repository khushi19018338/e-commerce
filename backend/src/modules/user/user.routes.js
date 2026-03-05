const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;
