import express from "express";
import { authenticateUser } from "../../middlewares/auth.middleware.js";
import { checkAdminRole } from "../../middlewares/admin.middleware.js";
import {
  createPincodeController,
  listPincodesController,
  togglePincodeController,
  updatePincodeController,
} from "../../controllers/admin/shipping.controller.js";

const router = express.Router();

router.use(authenticateUser);
router.use(checkAdminRole);

router.get("/", listPincodesController);
router.post("/", createPincodeController);
router.put("/:id", updatePincodeController);
router.patch("/:id/toggle", togglePincodeController);

export default router;
