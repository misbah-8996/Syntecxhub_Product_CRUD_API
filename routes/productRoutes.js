const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// GET all products
// POST new product
router
  .route("/")
  .get(getProducts)
  .post(createProduct);

// GET, UPDATE, DELETE single product
router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;