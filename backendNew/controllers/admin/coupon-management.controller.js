import { prisma } from "../../config/prisma.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { addCouponService, editCouponService } from "../../services/admin/coupon-management.service.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";
import { couponValidator } from "../../validators/admin/couponValidator.js";
import { logger } from "../../utils/logger.js";

// ─────────────────────────────────────────────────────────────────────────────
// CREATE COUPON  — POST /api/admin/coupons
// ─────────────────────────────────────────────────────────────────────────────
export const addCouponController = async (req, res, next) => {
    try {
        const { value, error } = couponValidator(req.body);
        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }

        const result = await addCouponService(value);
        return res.status(HTTP_RES.CREATED).json({
            success: true,
            message: "Coupon created successfully",
            data:    result,
        });
    } catch (error) {
        logger.error("addCoupon failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL COUPONS  — GET /api/admin/coupons
// ─────────────────────────────────────────────────────────────────────────────
export const getAllCouponsController = async (req, res, next) => {
    try {
        const { q, filter = "all", page = 1, limit = 10 } = req.query;
        const pageNum  = Math.max(Number(page) || 1, 1);
        const limitNum = Math.min(Number(limit) || 10, 100);

        // Build where clause
        const where = { deletedAt: null };

        if (filter === "active")     where.is_active = true;
        if (filter === "in-active")  where.is_active = false;

        if (q) {
            where.OR = [
                { code:        { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
            ];
        }

        const [coupons, total] = await Promise.all([
            prisma.coupon.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip:    limitNum * (pageNum - 1),
                take:    limitNum,
            }),
            prisma.coupon.count({ where }),
        ]);

        return res.status(HTTP_RES.OK).json({
            success: true,
            message: "Coupons retrieved successfully",
            data: {
                coupons,
                pages: Math.ceil(total / limitNum),
                page:  pageNum,
                limit: limitNum,
                total,
            },
        });
    } catch (error) {
        logger.error("getAllCoupons failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET COUPON BY ID  — GET /api/admin/coupons/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getCouponByIdController = async (req, res, next) => {
    try {
        const coupon = await prisma.coupon.findUnique({
            where: { id: req.params.id },
        });

        if (!coupon) {
            throw new ErrorWithStatus("Coupon not found", HTTP_RES.NOT_FOUND);
        }

        return res.status(HTTP_RES.OK).json({
            success: true,
            message: "Coupon retrieved successfully",
            data:    coupon,
        });
    } catch (error) {
        logger.error("getCouponById failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// EDIT COUPON  — PUT /api/admin/coupons/:id
// ─────────────────────────────────────────────────────────────────────────────
export const editCouponController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { value, error } = couponValidator(req.body);
        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }

        const result = await editCouponService(id, value);
        return res.status(HTTP_RES.OK).json({
            success: true,
            message: "Coupon updated successfully",
            data:    result,
        });
    } catch (error) {
        logger.error("editCoupon failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE COUPON STATUS  — PATCH /api/admin/coupons/:id/toggle
// ─────────────────────────────────────────────────────────────────────────────
export const toggleCouponController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const coupon = await prisma.coupon.findUnique({
            where: { id },
            select: { id: true, is_active: true },
        });

        if (!coupon) {
            throw new ErrorWithStatus("Coupon not found", HTTP_RES.NOT_FOUND);
        }

        await prisma.coupon.update({
            where: { id },
            data:  { is_active: !coupon.is_active },
        });

        return res.status(HTTP_RES.OK).json({
            success: true,
            message: `Coupon ${coupon.is_active ? "deactivated" : "activated"} successfully`,
        });
    } catch (error) {
        logger.error("toggleCoupon failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATE COUPON  — POST /api/admin/coupons/validate  (or user-side)
// ─────────────────────────────────────────────────────────────────────────────
export const validateCouponController = async (req, res, next) => {
    try {
        const { code, cartTotal } = req.body;
        const userId = req.user?.id;

        if (!code || !cartTotal) {
            throw new ErrorWithStatus("Coupon code and cart total are required", HTTP_RES.BAD_REQUEST);
        }

        // Find active coupon by code
        const coupon = await prisma.coupon.findFirst({
            where: { code, is_active: true, deletedAt: null },
        });

        if (!coupon) {
            throw new ErrorWithStatus("Coupon not found or inactive", HTTP_RES.NOT_FOUND);
        }

        // Check expiry
        if (new Date() > new Date(coupon.valid_until)) {
            throw new ErrorWithStatus("Coupon has expired", HTTP_RES.BAD_REQUEST);
        }

        // Check minimum order amount
        if (cartTotal < coupon.min_order_amount) {
            throw new ErrorWithStatus(
                `Minimum order of ₹${coupon.min_order_amount} required for this coupon`,
                HTTP_RES.BAD_REQUEST
            );
        }

        // Check global usage limit
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            throw new ErrorWithStatus("Coupon usage limit reached", HTTP_RES.CONFLICT);
        }

        // Check per-user usage limit
        if (userId) {
            const userUsageCount = await prisma.couponUsage.count({
                where: { coupon_id: coupon.id, user_id: userId },
            });
            if (userUsageCount >= coupon.per_user_limit) {
                throw new ErrorWithStatus("You have already used this coupon", HTTP_RES.CONFLICT);
            }
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.type === "PERCENTAGE") {
            discountAmount = (cartTotal * coupon.value) / 100;
            if (coupon.max_discount && discountAmount > coupon.max_discount) {
                discountAmount = coupon.max_discount;
            }
        } else {
            // FIXED
            discountAmount = coupon.value;
        }

        // Ensure discount doesn't exceed cart total
        discountAmount = Math.min(discountAmount, cartTotal);

        return res.status(HTTP_RES.OK).json({
            success: true,
            message: "Coupon is valid and applicable",
            data: {
                code:            coupon.code,
                type:            coupon.type,
                value:           coupon.value,
                discountAmount:  Math.round(discountAmount * 100) / 100,
                discountedTotal: Math.round((cartTotal - discountAmount) * 100) / 100,
            },
        });
    } catch (error) {
        logger.error("validateCoupon failed:", error.message);
        next(error);
    }
};
