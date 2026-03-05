const Order = require("./order.model");


// ✅ Create single order and return object (not array)
const createOrder = async (data, session) => {
  const order = new Order(data);
  return await order.save({ session });
};


// 📦 Get orders by user
const getOrdersByUser = async (userId) => {
  return await Order.find({ user: userId })
    .populate("items.product");
};


// 👑 Get all orders
const getAllOrders = async () => {
  return await Order.find()
    .populate("user")
    .populate("items.product");
};


module.exports = {
  createOrder,
  getOrdersByUser,
  getAllOrders
};