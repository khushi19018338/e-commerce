const orderService = require("./order.service");


// 🛒 CREATE ORDER + RAZORPAY ORDER
const createOrder = async (req, res, next) => {
  try {
    const result = await orderService.createOrder(req.user.id);

    console.log("Order created:", result.order._id);

    res.status(201).json({
      message: "Order created successfully",
      order: result.order,
      razorpayOrder: result.razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    next(error);
  }
};


// 🔐 VERIFY PAYMENT (Razorpay Signature Check)
const verifyPayment = async (req, res, next) => {
  try {
    console.log("Verify payment request body:", req.body);
    const result = await orderService.verifyPayment(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Payment verification error:", error);
    next(error);
  }
};


// 📦 GET MY ORDERS
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};


// 👑 GET ALL ORDERS (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders
};