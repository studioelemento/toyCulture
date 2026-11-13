import express from "express";
import { prisma } from "../config/prisma.js";

const router = express.Router();

// GET /api/brands — public list of active brands
router.get("/", async (_req, res, next) => {
  try {
    const brands = await prisma.brand.findMany({
      where: { is_active: true, deletedAt: null },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: { select: { products: true } },
      },
    });

    res.json({
      success: true,
      data: brands.map((b) => ({
        id: b.id,
        name: b.name,
        productCount: b._count.products,
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;

