import { prisma } from "../../config/prisma.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

// ── Get all reviews (paginated, filterable) ─────────────────────────────────
export async function getAllReviewsService({ page = 1, limit = 10, is_approved, search } = {}) {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(is_approved !== undefined && { is_approved }),
    ...(search && {
      OR: [
        { comment: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { first_name: { contains: search, mode: "insensitive" } } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ],
    }),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, first_name: true, last_name: true, email: true, avatar_url: true } },
        product: { select: { id: true, name: true, images: true } },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ── Get single review ───────────────────────────────────────────────────────
export async function getReviewByIdService(id) {
  const review = await prisma.review.findFirst({
    where: { id, deletedAt: null },
    include: {
      user: { select: { id: true, first_name: true, last_name: true, email: true, avatar_url: true } },
      product: { select: { id: true, name: true, images: true } },
    },
  });

  if (!review) throw new ErrorWithStatus("Review not found", HTTP_RES.NOT_FOUND);
  return review;
}

// ── Approve / reject review ─────────────────────────────────────────────────
export async function approveReviewService(id, is_approved) {
  const review = await prisma.review.findFirst({ where: { id, deletedAt: null } });
  if (!review) throw new ErrorWithStatus("Review not found", HTTP_RES.NOT_FOUND);

  return prisma.review.update({
    where: { id },
    data: { is_approved },
    include: {
      user: { select: { id: true, first_name: true, last_name: true, email: true } },
      product: { select: { id: true, name: true } },
    },
  });
}

// ── Soft-delete review ──────────────────────────────────────────────────────
export async function deleteReviewService(id) {
  const review = await prisma.review.findFirst({ where: { id, deletedAt: null } });
  if (!review) throw new ErrorWithStatus("Review not found", HTTP_RES.NOT_FOUND);

  return prisma.review.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

