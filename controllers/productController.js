const mongoose = require("mongoose");
const Product = require("../models/Products");

// ========================================
// CREATE PRODUCT
// POST /api/products
// ========================================

const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category } = req.body;

    const product = await Product.create({
      name,
      price,
      description,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// GET ALL PRODUCTS
// GET /api/products
// ========================================

const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // -------------------------------
    // Category filtering
    // -------------------------------

    if (category) {
      filter.category = category;
    }

    // -------------------------------
    // Price filtering
    // -------------------------------

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        const minimum = Number(minPrice);

        if (Number.isNaN(minimum)) {
          return res.status(400).json({
            success: false,
            message: "minPrice must be a valid number",
          });
        }

        filter.price.$gte = minimum;
      }

      if (maxPrice !== undefined) {
        const maximum = Number(maxPrice);

        if (Number.isNaN(maximum)) {
          return res.status(400).json({
            success: false,
            message: "maxPrice must be a valid number",
          });
        }

        filter.price.$lte = maximum;
      }
    }

    // -------------------------------
    // Pagination
    // -------------------------------

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Limit must be a positive integer",
      });
    }

    const skip = (pageNumber - 1) * limitNumber;

    // -------------------------------
    // Get products
    // -------------------------------

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(
      totalProducts / limitNumber
    );

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNumber,
        pageSize: limitNumber,
        totalProducts,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// ========================================

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ========================================

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const { name, price, description, category } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        description,
        category,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ========================================

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};