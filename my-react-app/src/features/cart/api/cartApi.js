import API from "../../../config/axios";

export const getCart = () =>
  API.get("/cart");

export const addToCart = (data) =>
  API.post("/cart", data);

export const removeFromCart = (productId) =>
  API.delete(`/cart/${productId}`);