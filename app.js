const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
const app = express();

// Parse JSON requests
app.use(express.json());

// ========================================
// Root route
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product CRUD API is running",
  });
});

// ========================================
// Product routes
// ========================================

app.use("/api/products", productRoutes);

// ========================================
// 404 handler
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========================================
// Global error handler
// ========================================

app.use(errorHandler);

// ========================================
// Start server
// ========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();