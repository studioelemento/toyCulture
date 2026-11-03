import { prisma } from "../../config/prisma.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

// ─────────────────────────────────────────────────────────────────────────────
// CREATE COUPON
// ─────────────────────────────────────────────────────────────────────────────
export const addCouponService = async (value) => {
    // Check for duplicate code
    if (value?.code) {
        const existing = await prisma.coupon.findUnique({
            where: { code: value.code },
        });
        if (existing) {
            throw new ErrorWithStatus("Coupon code already exists", HTTP_RES.CONFLICT);
        }
    }

    const coupon = await prisma.coupon.create({
        data: {
            code:             value.code,
            description:      value.description || null,
            type:             value.type,
            value:            parseFloat(value.value),
            min_order_amount: value.min_order_amount ? parseFloat(value.min_order_amount) : 0,
            max_discount:     value.max_discount ? parseFloat(value.max_discount) : null,
            usage_limit:      value.usage_limit ? parseInt(value.usage_limit, 10) : null,
            per_user_limit:   value.per_user_limit ? parseInt(value.per_user_limit, 10) : 1,
            valid_from:       value.valid_from ? new Date(value.valid_from) : new Date(),
            valid_until:      new Date(value.valid_until),
            is_active:        value.is_active !== undefined ? Boolean(value.is_active) : true,
        },
    });

    return coupon;
};

// ─────────────────────────────────────────────────────────────────────────────
// EDIT COUPON
// ─────────────────────────────────────────────────────────────────────────────
export const editCouponService = async (couponId, value) => {
    // Check coupon exists
    const existing = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!existing) {
        throw new ErrorWithStatus("Coupon not found", HTTP_RES.NOT_FOUND);
    }

    // Check for duplicate code (exclude current)
    if (value?.code) {
        const duplicate = await prisma.coupon.findFirst({
            where: {
                code: value.code,
                NOT:  { id: couponId },
            },
        });
        if (duplicate) {
            throw new ErrorWithStatus("Coupon code already exists", HTTP_RES.CONFLICT);
        }
    }

    const updateData = {};
    if (value.code !== undefined)             updateData.code = value.code;
    if (value.description !== undefined)      updateData.description = value.description || null;
    if (value.type !== undefined)             updateData.type = value.type;
    if (value.value !== undefined)            updateData.value = parseFloat(value.value);
    if (value.min_order_amount !== undefined)  updateData.min_order_amount = parseFloat(value.min_order_amount);
    if (value.max_discount !== undefined)      updateData.max_discount = value.max_discount ? parseFloat(value.max_discount) : null;
    if (value.usage_limit !== undefined)       updateData.usage_limit = value.usage_limit ? parseInt(value.usage_limit, 10) : null;
    if (value.per_user_limit !== undefined)    updateData.per_user_limit = parseInt(value.per_user_limit, 10);
    if (value.valid_from !== undefined)        updateData.valid_from = new Date(value.valid_from);
    if (value.valid_until !== undefined)       updateData.valid_until = new Date(value.valid_until);
    if (value.is_active !== undefined)         updateData.is_active = Boolean(value.is_active);

    const coupon = await prisma.coupon.update({
        where: { id: couponId },
        data:  updateData,
    });

    return coupon;
};