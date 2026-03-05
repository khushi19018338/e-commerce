import API from "../../../config/axios";

export const getMyOrders = () =>
  API.get("/orders/my-orders");

export const getAllOrders = () =>
  API.get("/orders");