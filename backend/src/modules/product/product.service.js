const productRepository = require("./product.repository");
const mongoose = require("mongoose");

const createProduct = async (data, userId) => {
  return await productRepository.createProduct({
    ...data,
    createdBy: userId
  });
};

const getAllProducts = async (query) => {
  const filters = {
    search: query.search,
    category: query.category,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice
  };

  const options = {
    page: query.page,
    limit: query.limit,
    sort: query.sort
  };

  return await productRepository.getAllProducts(filters, options);
};



const getProductById = async (id) => {
  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid productId format:", id);
    throw new Error("Invalid product ID format");
  }

  const product = await productRepository.getProductById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const updateProduct = async (id, data) => {
  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid productId format:", id);
    throw new Error("Invalid product ID format");
  }

  const product = await productRepository.updateProduct(id, data);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const deleteProduct = async (id) => {
  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid productId format:", id);
    throw new Error("Invalid product ID format");
  }

  const product = await productRepository.deleteProduct(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
