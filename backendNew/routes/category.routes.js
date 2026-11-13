import express from "express";
import { prisma } from "../config/prisma.js";

const router = express.Router();

// GET /api/categories — public list of active categories
router.get("/", async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { is_active: true, deletedAt: null },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        parent_id: true,
        seo_description: true,
        _count: { select: { products: true } },
      },
    });

    res.json({
      success: true,
      data: categories.map((c) => ({
        id: c.id,
        name: c.name,
        parent_id: c.parent_id,
        description: c.seo_description,
        productCount: c._count.products,
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;

