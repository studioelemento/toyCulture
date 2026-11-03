import { prisma } from "../../config/prisma.js";
import { computeDateRange } from "../../services/admin/salesReport.service.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import cloudinary from "../../utils/cloudinary.js";
import { logger } from "../../utils/logger.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET SALES REPORT  — GET /api/admin/reports
// ─────────────────────────────────────────────────────────────────────────────
export const getSalesReportController = async (req, res, next) => {
    try {
        const { range, start, end, page = 1, limit = 10 } = req.query;
        const { startDate, endDate } = computeDateRange(range, start, end);
        const pageNum  = Math.max(Number(page) || 1, 1);
        const limitNum = Math.min(Number(limit) || 10, 100);

        const dateFilter = {
            createdAt: { gte: startDate, lte: endDate },
            deletedAt: null,
        };

        const [orders, totalOrders, grandTotalOrder, revenueAgg] = await Promise.all([
            prisma.order.findMany({
                where:   dateFilter,
                include: {
                    user:  { select: { id: true, first_name: true, last_name: true, email: true } },
                    items: true,
                    coupon: { select: { id: true, code: true, type: true, value: true, max_discount: true } },
                },
                orderBy: { createdAt: "desc" },
                skip:    limitNum * (pageNum - 1),
                take:    limitNum,
            }),
            prisma.order.count({ where: dateFilter }),
            prisma.order.count({ where: { deletedAt: null } }),
            prisma.order.aggregate({
                where: { deletedAt: null, payment_status: "PAID" },
                _sum:  { total_amount: true },
            }),
        ]);

        const grandTotalAmount = revenueAgg._sum.total_amount ?? 0;
        const totalPages = Math.ceil(totalOrders / limitNum);

        // Calculate coupon discounts from paid orders with coupons
        const couponOrders = await prisma.order.findMany({
            where: {
                deletedAt:      null,
                payment_status: "PAID",
                coupon_id:      { not: null },
            },
            include: {
                coupon: true,
                items:  true,
            },
        });

        let totalCouponDiscountAmount = 0;
        let totalCouponsUsed          = 0;

        for (const order of couponOrders) {
            if (!order.coupon) continue;

            const subtotal = order.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            if (subtotal >= (order.coupon.min_order_amount || 0)) {
                let discount = 0;
                if (order.coupon.type === "PERCENTAGE") {
                    discount = (subtotal * order.coupon.value) / 100;
                    if (order.coupon.max_discount && discount > order.coupon.max_discount) {
                        discount = order.coupon.max_discount;
                    }
                } else {
                    discount = order.coupon.value;
                }
                totalCouponDiscountAmount += discount;
                totalCouponsUsed++;
            }
        }

        return res.status(HTTP_RES.OK).json({
            success: true,
            message: "Report retrieved successfully",
            data: {
                orders,
                pages:     totalPages,
                page:      pageNum,
                limit:     limitNum,
                startDate,
                endDate,
                grandTotalOrder,
                grandTotalAmount,
                totalCouponDiscountAmount: Math.round(totalCouponDiscountAmount * 100) / 100,
                totalCouponsUsed,
            },
        });
    } catch (error) {
        logger.error("getSalesReport failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET SALES REPORT (DOWNLOADABLE)  — GET /api/admin/reports/download
// ─────────────────────────────────────────────────────────────────────────────
export const getSalesReportDownloadableController = async (req, res, next) => {
    try {
        const { range, start, end } = req.query;
        const { startDate, endDate } = computeDateRange(range, start, end);

        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                deletedAt: null,
            },
            include: {
                user:             { select: { email: true, phone: true, first_name: true, last_name: true } },
                shipping_address: true,
                coupon:           { select: { type: true, value: true, code: true, max_discount: true, min_order_amount: true } },
                items: {
                    include: {
                        product: { select: { id: true, name: true, images: true } },
                        variant: { select: { color: true, size: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const simplifiedOrders = orders.map((order) => {
            const subtotal = order.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            let couponDiscountApplied = 0;
            if (order.coupon) {
                if (subtotal >= (order.coupon.min_order_amount || 0)) {
                    if (order.coupon.type === "PERCENTAGE") {
                        couponDiscountApplied = (subtotal * order.coupon.value) / 100;
                        if (order.coupon.max_discount && couponDiscountApplied > order.coupon.max_discount) {
                            couponDiscountApplied = order.coupon.max_discount;
                        }
                    } else {
                        couponDiscountApplied = order.coupon.value;
                    }
                }
            }

            return {
                ...order,
                subtotal: Math.round(subtotal * 100) / 100,
                couponDiscountApplied: Math.round(couponDiscountApplied * 100) / 100,
            };
        });

        return res.status(HTTP_RES.OK).json({
            success: true,
            message: "Downloadable report retrieved successfully",
            data: {
                orders:     simplifiedOrders,
                totalOrders: simplifiedOrders.length,
                startDate,
                endDate,
            },
        });
    } catch (error) {
        logger.error("getSalesReportDownloadable failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET SINGLE ORDER INVOICE  — GET /api/admin/reports/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getSaleReportDownloadableController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                shipping_address: true,
                coupon:           true,
                items: {
                    include: {
                        product: { select: { id: true, name: true, images: true } },
                        variant: { select: { color: true, size: true } },
                    },
                },
            },
        });

        if (!order) {
            throw new ErrorWithStatus("Order not found", HTTP_RES.NOT_FOUND);
        }

        // Resolve images
        const items = order.items.map((item) => {
            let imageUrl = "";
            const images = item.product?.images;
            if (Array.isArray(images) && images.length > 0) {
                const first = images[0];
                const raw   = typeof first === "string" ? first : first?.url || "";
                imageUrl    = raw.startsWith("http") ? raw : cloudinary.url(raw, { secure: true });
            }

            return {
                ...item,
                image: imageUrl,
                name:  item.product_name || item.product?.name || "Unknown",
                color: item.variant?.color || null,
                size:  item.variant?.size  || null,
            };
        });

        const subtotal = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        let couponDiscountApplied = 0;
        if (order.coupon) {
            if (order.coupon.type === "PERCENTAGE") {
                couponDiscountApplied = (subtotal * order.coupon.value) / 100;
                if (order.coupon.max_discount && couponDiscountApplied > order.coupon.max_discount) {
                    couponDiscountApplied = order.coupon.max_discount;
                }
            } else {
                couponDiscountApplied = order.coupon.value;
            }
        }

        return res.status(200).json({
            success: true,
            message: "Order invoice retrieved successfully",
            data: {
                ...order,
                items,
                subtotal:              Math.round(subtotal * 100) / 100,
                couponDiscountApplied: Math.round(couponDiscountApplied * 100) / 100,
            },
        });
    } catch (error) {
        logger.error("getSaleReportDownloadable failed:", error.message);
        next(error);
    }
};
