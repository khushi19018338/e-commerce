const Cart = require("./cart.model");

const findCartByUserId = (userId) =>
  Cart.findOne({ user: userId }).populate("items.product");

const createCart = (data) => Cart.create(data);

const saveCart = (cart) => cart.save();

module.exports = {
  findCartByUserId,
  createCart,
  saveCart
};
