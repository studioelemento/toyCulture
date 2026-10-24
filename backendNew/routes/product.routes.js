import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// Public routes for customer storefront
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin / creation routes
router.post("/", createProduct);
router.delete("/:id", deleteProduct);

export default router;
