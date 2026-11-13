import { cartValidator } from "../validators/cartValidator.js";
import {
  removeCartService,
  updateCartService,
} from "../services/cart.service.js";
import { prisma } from "../config/prisma.js";
import cloudinary from "../utils/cloudinary.js";
import { toFixedNum } from "../utils/toFixedNum.js";
import ErrorWithStatus from "../config/ErrorWithStatus.js";
import { HTTP_RES } from "../utils/CONSTANTS.js";

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

export const updateCartController = async (req, res, next) => {
  try {
    const currentUser = req.email;
    const { value, error } = cartValidator(req.body);
    if (error) throw error;

    const result = await updateCartService(currentUser, value);
    res.json({ data: result, message: "Cart Updated Successfully", status: "success" });
  } catch (error) {
    next(error);
  }
};

export const removeCartController = async (req, res, next) => {
  try {
    const currentUser = req.email;
    const { id } = req.params;
    const result = await removeCartService(currentUser, id);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export const getAllCartController = async (req, res, next) => {
  try {
    const currentUser = req.email;
    const user = await prisma.user.findUnique({ where: { email: currentUser } });
    if (!user) throw new ErrorWithStatus("User not found", HTTP_RES.NOT_FOUND);

    const cart = await prisma.cart.findUnique({
      where: { user_id: user.id },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
            variant: true,
          },
        },
      },
    });

    const cartItems = cart?.items || [];

    const simplifiedCartItems = cartItems.map((item) => {
      const product = item.product;
      const category = product?.category;
      const variant = item.variant;
      const isActive =
        Boolean(product?.is_active) &&
        !product?.deletedAt &&
        (!category || category.is_active);

      const discount = Math.max(
        Number(product?.discount || 0),
        Number(category?.discount || 0)
      );

      return {
        id: item.id,
        _id: item.id,
        variant_id: variant?.id || item.variant_id || null,
        product_id: product.id,
        name: product.name,
        color: variant?.color || null,
        price: product.price,
        discount,
        size: variant?.size || null,
        stock: variant?.stock ?? product.stockQTY,
        is_active: isActive,
        image: productImageUrl(product.images),
        quantity: item.quantity,
      };
    });

    const subtotal = toFixedNum(
      simplifiedCartItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
    );
    const discountApplied = toFixedNum(
      simplifiedCartItems.reduce(
        (acc, cur) => acc + cur.price * (cur.discount / 100) * cur.quantity,
        0
      )
    );
    const discountAppliedInPercentage = subtotal
      ? toFixedNum((discountApplied / subtotal) * 100)
      : 0;
    const total =
      subtotal - discountApplied + (simplifiedCartItems.length === 0 ? 0 : 15);

    return res.status(200).json({
      message: "Cart Items received Successfully",
      data: {
        cart: simplifiedCartItems,
        subtotal,
        discountApplied,
        total,
        discountAppliedInPercentage,
      },
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};
