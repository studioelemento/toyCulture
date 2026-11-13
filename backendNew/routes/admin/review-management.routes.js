import express from "express";
import { authenticateUser } from "../../middlewares/auth.middleware.js";
import { checkAdminRole }  from "../../middlewares/admin.middleware.js";
import {
  getAllReviewsController,
  getReviewController,
  approveReviewController,
  deleteReviewController,
} from "../../controllers/admin/review-management.controller.js";

const router = express.Router();

router.use(authenticateUser);
router.use(checkAdminRole);

router.get("/",             getAllReviewsController);
router.get("/:id",          getReviewController);
router.patch("/:id/approve", approveReviewController);
router.delete("/:id",       deleteReviewController);

export default router;
