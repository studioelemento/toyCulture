import { prisma } from '../../config/prisma.js';
import ErrorWithStatus from '../../config/ErrorWithStatus.js';
import { HTTP_RES } from '../../utils/CONSTANTS.js';

export function calculateCouponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  let discountAmount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discountAmount = (subtotal * coupon.value) / 100;
    if (coupon.max_discount) {
      discountAmount = Math.min(discountAmount, coupon.max_discount);
    }
  } else {
    discountAmount = coupon.value;
  }
  return Math.min(discountAmount, subtotal);
}

export async function validateCouponForUser({ code, subtotal, userId }) {
  if (!code?.trim()) {
    throw new ErrorWithStatus('Coupon code is required', HTTP_RES.BAD_REQUEST);
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon || !coupon.is_active || coupon.deletedAt) {
    throw new ErrorWithStatus('Invalid or inactive coupon', HTTP_RES.BAD_REQUEST);
  }

  if (new Date(coupon.valid_until) <= new Date()) {
    throw new ErrorWithStatus('This coupon has expired', HTTP_RES.BAD_REQUEST);
  }

  if (coupon.usage_limit != null && coupon.used_count >= coupon.usage_limit) {
    throw new ErrorWithStatus('This coupon has reached its usage limit', HTTP_RES.BAD_REQUEST);
  }

  const sub = Number(subtotal) || 0;
  if (sub < coupon.min_order_amount) {
    throw new ErrorWithStatus(
      `Minimum order amount for this coupon is ₹${coupon.min_order_amount}`,
      HTTP_RES.BAD_REQUEST
    );
  }

  if (userId && coupon.per_user_limit > 0) {
    const uses = await prisma.couponUsage.count({
      where: { coupon_id: coupon.id, user_id: userId },
    });
    if (uses >= coupon.per_user_limit) {
      throw new ErrorWithStatus('You have already used this coupon', HTTP_RES.BAD_REQUEST);
    }
  }

  const discount = calculateCouponDiscount(coupon, sub);
  return {
    code: coupon.code,
    description: coupon.description,
    discount,
    total_after_discount: Math.max(0, sub - discount),
    coupon,
  };
}
