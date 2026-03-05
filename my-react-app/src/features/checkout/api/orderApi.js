import API from "../../../config/axios";

export const createOrder = (data) =>
  API.post("/orders", data);

export const verifyPayment = (data) =>
  API.post("/orders/verify", data);

export const getMyOrders = () =>
  API.get("/orders/my-orders");