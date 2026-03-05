const mongoose = require("mongoose");
const crypto = require("crypto");
const razorpay = require("../../config/razorpay");

const orderRepository = require("./order.repository");
const Cart = require("../cart/cart.model");
const Product = require("../product/product.model");
const Order = require("./order.model");


// 🛒 1️⃣ CREATE ORDER (DB + Razorpay)
const createOrder = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    // Reserve stock (don't deduct yet, just check)
    totalAmount += product.price * item.quantity;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price
    });
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    paymentStatus: "UNPAID",
    status: "PENDING"
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: "INR",
    receipt: `receipt_${order._id}`
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  // DON'T clear cart here - wait for payment to be verified
  // The cart will be cleared in verifyPayment after successful payment

  return { order, razorpayOrder };
};



// 🔐 2️⃣ VERIFY PAYMENT (Secure)
const verifyPayment = async (data) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = data;

  console.log("Verifying payment with:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error("Missing payment details");
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  console.log("Expected signature:", expectedSignature);
  console.log("Received signature:", razorpay_signature);

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

  console.log("Found order:", order);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "PAID") {
    return { message: "Order already verified" };
  }

  // Update order
  order.paymentStatus = "PAID";
  order.status = "CONFIRMED";
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;

  await order.save();

  // Deduct stock and clear cart after successful payment
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  }

  // Clear the user's cart after successful payment
  const cart = await Cart.findOne({ user: order.user });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  return { message: "Payment verified successfully" };
};



// 📦 3️⃣ GET ORDERS
const getMyOrders = async (userId) => {
  return await orderRepository.getOrdersByUser(userId);
};

const getAllOrders = async () => {
  return await orderRepository.getAllOrders();
};


module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders
};