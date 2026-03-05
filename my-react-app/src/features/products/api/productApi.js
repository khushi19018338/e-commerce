import API from "../../../config/axios";

export const getProducts = (params) =>
  API.get("/products", { params });

export const getProductById = (id) =>
  API.get(`/products/${id}`);

export const createProduct = (data) => {
  // If data contains a file, use FormData
  if (data instanceof FormData) {
    return API.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  return API.post("/products", data);
};

export const updateProduct = (id, data) => {
  // If data contains a file, use FormData
  if (data instanceof FormData) {
    return API.put(`/products/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  return API.put(`/products/${id}`, data);
};

export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);
