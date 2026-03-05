const cartService = require("./cart.service");

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    
    // Debug logging
    console.log("Request body:", req.body);
    console.log("User from token:", req.user);
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }
    
    const cart = await cartService.addToCart(
      req.user.id,
      productId,
      quantity
    );
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.removeFromCart(
      req.user.id,
      productId
    );
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart
};
