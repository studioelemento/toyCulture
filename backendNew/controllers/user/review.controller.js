import { getProductReviewsService, submitReviewService } from "../../services/user/review.service.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

// GET /api/reviews/:productId
export async function getProductReviewsController(req, res, next) {
  try {
    const { productId } = req.params;
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 5;

    const data = await getProductReviewsService(productId, { page, limit });
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
export async function submitReviewController(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(HTTP_RES.UNAUTHORIZED).json({
        success: false,
        message: "You must be logged in to write a review",
      });
    }

    const review = await submitReviewService(userId, req.body);
    res.status(HTTP_RES.CREATED).json({
      success: true,
      message: "Review submitted successfully! It will appear after admin approval.",
      review,
    });
  } catch (err) {
    next(err);
  }
}

