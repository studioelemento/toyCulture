import { prisma } from "../../config/prisma.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

// Helper to get or create a user's wishlist
const getOrCreateWishlist = async (userId) => {
  let wishlist = await prisma.wishlist.findUnique({
    where: { user_id: userId },
  });
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { user_id: userId },
    });
  }
  return wishlist;
};

export const addWishlistController = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ErrorWithStatus("Unauthorized", HTTP_RES.UNAUTHORIZED);

    const productId = req.body.product_id || req.body.variant_id;
    if (!productId) {
      throw new ErrorWithStatus("Product ID is required", HTTP_RES.BAD_REQUEST);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || !product.is_active) {
      throw new ErrorWithStatus("Product not found or inactive", HTTP_RES.BAD_REQUEST);
    }

    const wishlist = await getOrCreateWishlist(userId);

    // Toggle logic: If already in wishlist, remove it; otherwise add it
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlist_id_product_id: {
          wishlist_id: wishlist.id,
          product_id: productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return res.status(HTTP_RES.OK).json({
        success: true,
        message: "Removed from wishlist",
        wishlisted: false,
      });
    } else {
      const item = await prisma.wishlistItem.create({
        data: {
          wishlist_id: wishlist.id,
          product_id: productId,
        },
      });
      return res.status(HTTP_RES.CREATED).json({
        success: true,
        message: "Added to wishlist",
        wishlisted: true,
        data: item,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const removeWishlistController = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ErrorWithStatus("Unauthorized", HTTP_RES.UNAUTHORIZED);

    const { id } = req.params; // this can be WishlistItem id OR product_id
    const wishlist = await prisma.wishlist.findUnique({
      where: { user_id: userId },
    });

    if (!wishlist) {
      return res.status(HTTP_RES.OK).json({ success: true, message: "Item removed" });
    }

    // Try deleting by WishlistItem id or by product_id
    await prisma.wishlistItem.deleteMany({
      where: {
        wishlist_id: wishlist.id,
        OR: [{ id }, { product_id: id }],
      },
    });

    return res.status(HTTP_RES.OK).json({
      success: true,
      message: "Wishlist item removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllWishlistController = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ErrorWithStatus("Unauthorized", HTTP_RES.UNAUTHORIZED);

    const wishlist = await prisma.wishlist.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
                category: true,
                reviews: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const items = (wishlist?.items || []).map((item) => {
      const p = item.product;
      const imagesArr = Array.isArray(p.images) ? p.images : [];
      const image = imagesArr[0] || "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";
      const avgRating =
        p.reviews?.length > 0
          ? (p.reviews.reduce((s, r) => s + (r.rating || 0), 0) / p.reviews.length).toFixed(1)
          : 4.8;

      return {
        id: item.id,
        itemId: item.id,
        productId: p.id,
        name: p.name,
        price: p.sellingPrice ?? p.price,
        originalPrice: p.mrp ?? p.price,
        rating: Number(avgRating),
        reviews: p.reviews?.length || 0,
        inStock: (p.stockQTY ?? 0) > 0,
        badge: (p.stockQTY ?? 0) > 0 ? "In Stock" : "Out of Stock",
        category: p.category?.name || "Toys",
        brand: p.brand?.name || "ToyCulture",
        image,
      };
    });

    return res.status(HTTP_RES.OK).json({
      success: true,
      data: items,
      total: items.length,
    });
  } catch (error) {
    next(error);
  }
};
