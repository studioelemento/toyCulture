import {
  getAllReviewsService,
  getReviewByIdService,
  approveReviewService,
  deleteReviewService,
} from "../../services/admin/review-management.service.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

// GET /api/admin/reviews
export async function getAllReviewsController(req, res, next) {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search      = req.query.search || "";
    const is_approved =
      req.query.is_approved === "true"  ? true  :
      req.query.is_approved === "false" ? false : undefined;

    const data = await getAllReviewsService({ page, limit, is_approved, search });
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/reviews/:id
export async function getReviewController(req, res, next) {
  try {
    const review = await getReviewByIdService(req.params.id);
    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/reviews/:id/approve
export async function approveReviewController(req, res, next) {
  try {
    const is_approved = req.body.is_approved === true || req.body.is_approved === "true";
    const review = await approveReviewService(req.params.id, is_approved);
    res.json({ success: true, message: `Review ${is_approved ? "approved" : "rejected"} successfully`, review });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/reviews/:id
export async function deleteReviewController(req, res, next) {
  try {
    await deleteReviewService(req.params.id);
    res.status(HTTP_RES.OK).json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
}

