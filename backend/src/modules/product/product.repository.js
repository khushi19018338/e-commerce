const Product = require("./product.model");

const createProduct = (data) => Product.create(data);

const getAllProducts = async (filters, options) => {
  const queryObject = {};

  // 🔍 TEXT SEARCH
  if (filters.search) {
    queryObject.$text = {
      $search: filters.search
    };
  }

  if (filters.category) {
    queryObject.category = filters.category;
  }

  if (filters.minPrice || filters.maxPrice) {
    queryObject.price = {};

    if (filters.minPrice) {
      queryObject.price.$gte = Number(filters.minPrice);
    }

    if (filters.maxPrice) {
      queryObject.price.$lte = Number(filters.maxPrice);
    }
  }

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const sort = options.sort || "-createdAt";

  const products = await Product.find(queryObject)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(queryObject);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    products
  };
};



const getProductById = (id) => Product.findById(id);

const updateProduct = (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true });

const deleteProduct = (id) => Product.findByIdAndDelete(id);

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
