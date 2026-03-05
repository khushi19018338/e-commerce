const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("./product.controller");
const {
  authMiddleware,
  authorizeRoles
} = require("../../middleware/auth.middleware");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  upload.single("image"),
  productController.createProduct
);

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  productController.deleteProduct
);

module.exports = router;
