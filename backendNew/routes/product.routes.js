import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// ── Storefront read queries ──────────────────────────────────────────────────
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// ── Product CRUD (used by Admin Panel AddProduct & ProductList) ──────────────
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
