import { prisma } from "../../config/prisma.js";
import cloudinary from "../../utils/cloudinary.js";
import { toFixedNum } from "../../utils/toFixedNum.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

function productImageUrl(images) {
  const first = Array.isArray(images) ? images[0] : null;
  const raw = typeof first === "string" ? first : first?.url || null;
  if (!raw) return null;
  try {
    return cloudinary.url(raw, { secure: true });
  } catch {
    return raw;
  }
}

function mapCheckoutItem({ id, product, variant, quantity }) {
  const category = product?.category;
  const isActive =
    Boolean(product?.is_active) &&
    !product?.deletedAt &&
    (!category || category.is_active);

  const discount = Math.max(
    Number(product?.discount || 0),
    Number(category?.discount || 0)
  );

  return {
    id,
    _id: id,
    variant_id: variant?.id || null,
    product_id: product.id,
    name: product.name,
    color: variant?.color || null,
    price: product.price,
    discount,
    size: variant?.size || null,
    stock: variant?.stock ?? product.stockQTY,
    is_active: isActive,
    image: productImageUrl(product.images),
    quantity: Number(quantity),
  };
}

export const checkoutController = async (req, res, next) => {
  try {
    const user = req.user;
    const { variant_id = "", quantity = 0, buyNow = false } = req.query || {};

    if (!user) throw new ErrorWithStatus("Unauthorized User", HTTP_RES.UNAUTHORIZED);

    let checkoutOutItems = [];

    if (buyNow !== "true") {
      const cart = await prisma.cart.findUnique({
        where: { user_id: user.id },
        include: {
          items: {
            include: {
              product: { include: { category: true } },
              variant: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new ErrorWithStatus("Cart is empty", HTTP_RES.BAD_REQUEST);
      }

      checkoutOutItems = cart.items.map((item) =>
        mapCheckoutItem({
          id: item.id,
          product: item.product,
          variant: item.variant,
          quantity: item.quantity,
        })
      );
    } else {
      if (!variant_id) {
        throw new ErrorWithStatus("variant_id is required for buy now", HTTP_RES.BAD_REQUEST);
      }

      const variant = await prisma.productVariant.findFirst({
        where: { id: variant_id, deletedAt: null },
        include: {
          product: { include: { category: true } },
        },
      });

      if (!variant?.product) {
        throw new ErrorWithStatus("Invalid variant", HTTP_RES.BAD_REQUEST);
      }

      checkoutOutItems = [
        mapCheckoutItem({
          id: variant.id,
          product: variant.product,
          variant,
          quantity: Number(quantity) || 1,
        }),
      ];
    }

    if (checkoutOutItems.find((x) => !x.is_active || x.quantity > x.stock)) {
      throw new ErrorWithStatus(
        "Includes unavailable or blocked items or out of stock",
        HTTP_RES.BAD_REQUEST
      );
    }

    const subtotal = toFixedNum(
      checkoutOutItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
    );
    const discountApplied = toFixedNum(
      checkoutOutItems.reduce(
        (acc, cur) => acc + cur.price * (cur.discount / 100) * cur.quantity,
        0
      )
    );
    const discountedAmount = toFixedNum(subtotal - discountApplied);
    const discountAppliedInPercentage = subtotal
      ? toFixedNum((discountApplied / subtotal) * 100)
      : 0;
    const delivery_fee = 15;
    const total = Number(discountedAmount) + delivery_fee;

    const address = await prisma.address.findMany({
      where: { user_id: user.id, deletedAt: null },
      orderBy: [{ is_primary: "desc" }, { createdAt: "desc" }],
    });

    const availableCoupons = await prisma.coupon.findMany({
      where: {
        is_active: true,
        deletedAt: null,
        min_order_amount: { lte: total },
        valid_until: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Checkout created Successfully",
      status: "success",
      data: {
        cart: checkoutOutItems,
        address,
        subtotal,
        discountApplied,
        discountedAmount,
        delivery_fee,
        discountAppliedInPercentage,
        total,
        availableCoupons,
      },
    });
  } catch (error) {
    next(error);
  }
};
