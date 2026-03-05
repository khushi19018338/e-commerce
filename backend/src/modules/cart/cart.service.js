const cartRepository = require("./cart.repository");
const Product = require("../product/product.model");
const mongoose = require("mongoose");

const addToCart = async (userId, productId, quantity) => {
  // Validate productId format
  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    console.log("Invalid productId format:", productId);
    throw new Error("Invalid product ID format");
  }

  const product = await Product.findById(productId);
  console.log("Product found:", product);

  if (!product) {
    throw new Error("Product not found - product may have been deleted or doesn't exist");
  }

  let cart = await cartRepository.findCartByUserId(userId);

  if (!cart) {
    cart = await cartRepository.createCart({
      user: userId,
      items: [{ product: productId, quantity }]
    });

    return cart;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  return await cartRepository.saveCart(cart);
};

const getCart = async (userId) => {
  const cart = await cartRepository.findCartByUserId(userId);

  if (!cart) {
    throw new Error("Cart is empty");
  }

  return cart;
};

const removeFromCart = async (userId, productId) => {
  const cart = await cartRepository.findCartByUserId(userId);

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product._id.toString() !== productId
  );

  return await cartRepository.saveCart(cart);
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart
};
