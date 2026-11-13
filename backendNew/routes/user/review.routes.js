import express from "express";
import { authenticateUser } from "../../middlewares/auth.middleware.js";
import {
  getProductReviewsController,
  submitReviewController,
} from "../../controllers/user/review.controller.js";

const router = express.Router();

// Public – anyone can read approved reviews
router.get("/:productId", getProductReviewsController);

// Protected – must be logged in to submit
router.post("/", authenticateUser, submitReviewController);

export default router;

