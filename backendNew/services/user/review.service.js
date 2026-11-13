import { prisma } from "../../config/prisma.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

// ── Get approved reviews for a product ──────────────────────────────────────
export async function getProductReviewsService(productId, { page = 1, limit = 5 } = {}) {
  const skip = (page - 1) * limit;

  const where = { product_id: productId, is_approved: true, deletedAt: null };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, first_name: true, last_name: true, avatar_url: true } },
      },
    }),
    prisma.review.count({ where }),
  ]);

  // Average rating (all approved reviews, not just this page)
  const agg = await prisma.review.aggregate({
    where,
    _avg: { rating: true },
    _count: { id: true },
  });

  return {
    reviews,
    averageRating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : 0,
    totalReviews: total,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ── Submit a review ──────────────────────────────────────────────────────────
export async function submitReviewService(userId, { product_id, rating, comment }) {
  if (!product_id) throw new ErrorWithStatus("product_id is required", HTTP_RES.BAD_REQUEST);
  if (!rating || rating < 1 || rating > 5)
    throw new ErrorWithStatus("Rating must be between 1 and 5", HTTP_RES.BAD_REQUEST);

  // Check product exists
  const product = await prisma.product.findFirst({ where: { id: product_id, deletedAt: null } });
  if (!product) throw new ErrorWithStatus("Product not found", HTTP_RES.NOT_FOUND);

  // Check if user already reviewed this product
  const existing = await prisma.review.findFirst({
    where: { user_id: userId, product_id, deletedAt: null },
  });
  if (existing) throw new ErrorWithStatus("You have already reviewed this product", 409);

  const review = await prisma.review.create({
    data: {
      user_id:    userId,
      product_id,
      rating:     parseInt(rating),
      comment:    comment?.trim() || null,
      is_approved: false, // admin must approve
    },
    include: {
      user: { select: { id: true, first_name: true, last_name: true } },
    },
  });

  return review;
}

