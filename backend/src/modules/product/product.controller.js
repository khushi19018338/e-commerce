const productService = require("./product.service");
const createProduct = async (req, res, next) => {
  try {

    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("FILE:", req.file);

    // If there's an uploaded file, set the image path
    const productData = {
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : null
    };

    const product = await productService.createProduct(
      productData,
      req.user.id
    );

    res.status(201).json(product);

  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts(req.query);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};



const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body
    );
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
