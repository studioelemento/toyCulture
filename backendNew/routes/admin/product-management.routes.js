import express from "express";
import {
    addProduct,
    editProduct,
    getAllProducts,
    getProduct,
    toggleProduct,
    deleteProduct,
} from "../../controllers/admin/product-management.controller.js";
import { authenticateUser } from "../../middlewares/auth.middleware.js";
import { checkAdminRole }   from "../../middlewares/admin.middleware.js";
import upload               from "../../middlewares/multer.js";

const router = express.Router();

// ── Auth guard — all routes below require admin access ──────────────────────
router.use(authenticateUser);
router.use(checkAdminRole);

// ── Product CRUD ────────────────────────────────────────────────────────────
router.get("/",                                     getAllProducts);
router.get("/:id",                                  getProduct);
router.post("/",     upload.array("images", 10),     addProduct);
router.put("/:id",   upload.array("images", 10),     editProduct);
router.patch("/:id", upload.array("images", 10),     editProduct);
router.patch("/toggle-status/:id",                   toggleProduct);
router.delete("/:id",                               deleteProduct);

export default router;