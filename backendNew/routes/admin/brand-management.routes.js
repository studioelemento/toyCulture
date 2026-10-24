import express from "express";
import { addBrand, editBrand, getAllBrand, getBrand, toggleBrand } from "../../controllers/admin/brand-management.controller.js";
import { authenticateUser } from "../../middlewares/auth.middleware.js";
import { checkAdminRole } from "../../middlewares/admin.middleware.js";

const router = express.Router();

router.post("", addBrand);
router.get("", getAllBrand);
router.get("/:id", getBrand);
router.put("/:id", editBrand);
router.patch("/toggle/:id", toggleBrand);

export default router;
