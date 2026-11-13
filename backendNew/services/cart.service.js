import { prisma } from "../config/prisma.js";
import ErrorWithStatus from "../config/ErrorWithStatus.js";
import { HTTP_RES } from "../utils/CONSTANTS.js";

async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({ where: { user_id: userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { user_id: userId } });
  }
  return cart;
}

export const updateCartService = async (currentUser, { variant_id, product_id, quantity }) => {
  const user = await prisma.user.findUnique({ where: { email: currentUser } });
  if (!user) throw new ErrorWithStatus("User not found", HTTP_RES.NOT_FOUND);

  let variant = null;
  let product = null;

  if (variant_id) {
    variant = await prisma.productVariant.findFirst({
      where: { id: variant_id, deletedAt: null, is_active: true },
      include: {
        product: {
          include: { category: true },
        },
      },
    });
    if (!variant?.product || !variant.product.is_active || variant.product.deletedAt) {
      throw new ErrorWithStatus("Invalid request", HTTP_RES.BAD_REQUEST);
    }
    if (variant.product.category && !variant.product.category.is_active) {
      throw new ErrorWithStatus("Invalid request", HTTP_RES.BAD_REQUEST);
    }
    product = variant.product;
  } else if (product_id) {
    product = await prisma.product.findFirst({
      where: { id: product_id, deletedAt: null, is_active: true },
      include: { category: true },
    });
    if (!product) throw new ErrorWithStatus("Invalid request", HTTP_RES.BAD_REQUEST);
    if (product.category && !product.category.is_active) {
      throw new ErrorWithStatus("Invalid request", HTTP_RES.BAD_REQUEST);
    }
  } else {
    throw new ErrorWithStatus("product_id or variant_id is required", HTTP_RES.BAD_REQUEST);
  }

  const cart = await getOrCreateCart(user.id);
  const resolvedProductId = product.id;
  const stock = variant ? variant.stock : product.stockQTY;

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cart_id_product_id: {
        cart_id: cart.id,
        product_id: resolvedProductId,
      },
    },
  });

  // Remove from wishlist when adding to cart
  const wishlist = await prisma.wishlist.findUnique({ where: { user_id: user.id } });
  if (wishlist) {
    await prisma.wishlistItem.deleteMany({
      where: { wishlist_id: wishlist.id, product_id: resolvedProductId },
    });
  }

  if (!existingItem) {
    if (quantity <= 0) throw new ErrorWithStatus("Invalid request", HTTP_RES.BAD_REQUEST);
    if (stock < quantity) throw new ErrorWithStatus("Insufficient Quantity", HTTP_RES.BAD_REQUEST);
    if (quantity > 5) throw new ErrorWithStatus("Max Items in cart", HTTP_RES.BAD_REQUEST);

    return prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id: resolvedProductId,
        variant_id: variant?.id || null,
        quantity,
      },
      include: {
        product: true,
        variant: true,
      },
    });
  }

  const nextQty = existingItem.quantity + quantity;
  if (nextQty > 5) throw new ErrorWithStatus("Max Items in cart", HTTP_RES.BAD_REQUEST);
  if (nextQty > 0 && stock < nextQty) {
    throw new ErrorWithStatus("Invalid Request : Insufficient stock", HTTP_RES.BAD_REQUEST);
  }

  if (nextQty <= 0) {
    await prisma.cartItem.delete({ where: { id: existingItem.id } });
    return {};
  }

  return prisma.cartItem.update({
    where: { id: existingItem.id },
    data: {
      quantity: nextQty,
      variant_id: variant?.id || existingItem.variant_id,
    },
    include: {
      product: true,
      variant: true,
    },
  });
};

export const removeCartService = async (currentUser, cartItemId) => {
  if (!cartItemId) throw new ErrorWithStatus("Cart Id is invalid", HTTP_RES.BAD_REQUEST);

  const user = await prisma.user.findUnique({ where: { email: currentUser } });
  if (!user) throw new ErrorWithStatus("User not found", HTTP_RES.NOT_FOUND);

  const cart = await prisma.cart.findUnique({ where: { user_id: user.id } });
  if (!cart) throw new ErrorWithStatus("Cart not found", HTTP_RES.NOT_FOUND);

  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cart_id: cart.id },
  });
  if (!item) throw new ErrorWithStatus("Cart item not found", HTTP_RES.NOT_FOUND);

  await prisma.cartItem.delete({ where: { id: item.id } });
  return item;
};
