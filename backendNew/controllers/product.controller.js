import { prisma } from "../config/prisma.js";

// Helper to normalize array inputs
const toArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
};

// ===================================================
// CREATE PRODUCT
// POST /api/v1/admin/products and POST /api/v1/products
// ===================================================
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      title,
      brand,
      brand_id,
      brandId,
      description,
      small_description,
      mrp,
      sellingPrice,
      price,
      onOffer,
      offerPrice,
      category,
      category_id,
      categoryId,
      ageGroup,
      stockQTY,
      metaTitle,
      metaDescription,
      metaKeywords,
      imageUrl,
      images,
      attributes,
    } = req.body;

    if (!name || (!mrp && !sellingPrice && !price)) {
      return res.status(400).json({
        success: false,
        message: "Product name and price (or MRP / Selling Price) are required.",
      });
    }

    const finalMrp = mrp !== undefined && mrp !== null && mrp !== "" ? parseFloat(mrp) : (sellingPrice ? parseFloat(sellingPrice) : (price ? parseFloat(price) : 0));
    const finalSellingPrice = sellingPrice !== undefined && sellingPrice !== null && sellingPrice !== "" ? parseFloat(sellingPrice) : (finalMrp || 0);
    const finalPrice = price !== undefined && price !== null && price !== "" ? parseFloat(price) : finalSellingPrice;

    // Normalize images into an array of URLs
    const rawImages = [
      ...toArray(images),
      ...toArray(imageUrl),
    ].filter(Boolean);

    const chosenBrandId = brand_id || brandId;
    const brandRelation = chosenBrandId
      ? { connect: { id: chosenBrandId } }
      : (brand && String(brand).trim()
          ? {
              connectOrCreate: {
                where: { name: String(brand).trim() },
                create: { name: String(brand).trim() },
              },
            }
          : undefined);

    const chosenCategoryId = category_id || categoryId;
    const categoryRelation = chosenCategoryId
      ? { connect: { id: chosenCategoryId } }
      : (category && String(category).trim()
          ? {
              connectOrCreate: {
                where: { name: String(category).trim() },
                create: { name: String(category).trim() },
              },
            }
          : undefined);

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        title: title ? title.trim() : null,
        description: description ? description.trim() : name.trim(),
        small_description: small_description ? small_description.trim() : (title ? title.trim() : name.trim()),
        mrp: finalMrp,
        sellingPrice: finalSellingPrice,
        price: finalPrice,
        onOffer: Boolean(onOffer),
        offerPrice: offerPrice !== undefined && offerPrice !== null && offerPrice !== "" ? parseFloat(offerPrice) : null,
        ageGroup: ageGroup || null,
        stockQTY: stockQTY ? parseInt(stockQTY, 10) : 0,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaKeywords: toArray(metaKeywords).map((k) => String(k).trim()).filter(Boolean),
        images: rawImages,
        brand: brandRelation,
        category: categoryRelation,
        attributes: Array.isArray(attributes) && attributes.length > 0
          ? {
              create: attributes
                .filter((attr) => attr && attr.attributeName && attr.attributeValue)
                .map((attr) => ({
                  attributeName: String(attr.attributeName).trim(),
                  attributeValue: String(attr.attributeValue).trim(),
                })),
            }
          : undefined,
      },
      include: {
        brand: true,
        category: {
          include: {
            parent: true,
          },
        },
        attributes: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    next(error);
  }
};

// ===================================================
// GET ALL PRODUCTS
// GET /api/v1/products
// ===================================================
export const getAllProducts = async (req, res, next) => {
  try {
    const { category, brand, search } = req.query;

    const where = {
      is_active: true,
    };

    if (category) {
      where.category = {
        name: { equals: category, mode: "insensitive" },
      };
    }

    if (brand) {
      where.brand = {
        name: { equals: brand, mode: "insensitive" },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: {
          include: {
            parent: true,
          },
        },
        attributes: true,
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const fallbackImage = "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";

    const sanitizeImgUrl = (img) => {
      if (typeof img !== "string") return img?.url || "";
      let trimmed = img.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:") || trimmed.startsWith("/")) {
        return trimmed;
      }
      if (trimmed.includes(".")) {
        return `https://${trimmed}`;
      }
      return fallbackImage;
    };

    const formatted = products.map((p) => {
      let imagesArr = [];
      if (Array.isArray(p.images)) {
        imagesArr = p.images.map(sanitizeImgUrl).filter(Boolean);
      }
      const mainImage = imagesArr[0] || fallbackImage;

      const avgRating = p.reviews && p.reviews.length > 0
        ? (p.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / p.reviews.length).toFixed(1)
        : 4.8;

      const effectivePrice = p.sellingPrice ?? p.price;
      const effectiveOriginalPrice = p.mrp ?? p.price;

      let discountText = null;
      if (p.discount > 0) {
        discountText = `${p.discount}%`;
      } else if (effectiveOriginalPrice > effectivePrice) {
        discountText = `${Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)}%`;
      }

      return {
        ...p,
        id: p.id,
        name: p.name,
        title: p.title || p.name,
        brand_id: p.brand_id,
        brand: p.brand?.name || "ToyCulture",
        brandObj: p.brand || null,
        category_id: p.category_id,
        category: p.category?.name || "Toys",
        categoryObj: p.category || null,
        parentCategory: p.category?.parent?.name || null,
        price: effectivePrice,
        originalPrice: effectiveOriginalPrice > effectivePrice ? effectiveOriginalPrice : null,
        image: mainImage,
        images: imagesArr.length > 0 ? imagesArr : [mainImage],
        rating: Number(avgRating),
        reviews: p.reviews?.length || 0,
        stock: p.stockQTY,
        badge: discountText ? "discount" : "new",
        discount: discountText,
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted,
      total: formatted.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    next(error);
  }
};

// ===================================================
// GET SINGLE PRODUCT
// GET /api/v1/products/:id
// ===================================================
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const p = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: {
          include: {
            parent: true,
          },
        },
        attributes: true,
        reviews: true,
      },
    });

    if (!p) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const fallbackImage = "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";
    const sanitizeImgUrl = (img) => {
      if (typeof img !== "string") return img?.url || "";
      let trimmed = img.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:") || trimmed.startsWith("/")) {
        return trimmed;
      }
      if (trimmed.includes(".")) {
        return `https://${trimmed}`;
      }
      return fallbackImage;
    };

    let imagesArr = [];
    if (Array.isArray(p.images)) {
      imagesArr = p.images.map(sanitizeImgUrl).filter(Boolean);
    }
    const mainImage = imagesArr[0] || fallbackImage;

    const avgRating = p.reviews && p.reviews.length > 0
      ? (p.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / p.reviews.length).toFixed(1)
      : 4.8;

    const effectivePrice = p.sellingPrice ?? p.price;
    const effectiveOriginalPrice = p.mrp ?? p.price;

    let discountText = null;
    if (p.discount > 0) {
      discountText = `${p.discount}%`;
    } else if (effectiveOriginalPrice > effectivePrice) {
      discountText = `${Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)}%`;
    }

    const formatted = {
      ...p,
      id: p.id,
      name: p.name,
      title: p.title || p.name,
      brand_id: p.brand_id,
      brand: p.brand?.name || "ToyCulture",
      brandObj: p.brand || null,
      category_id: p.category_id,
      category: p.category?.name || "Toys",
      categoryObj: p.category || null,
      parentCategory: p.category?.parent?.name || null,
      price: effectivePrice,
      originalPrice: effectiveOriginalPrice > effectivePrice ? effectiveOriginalPrice : null,
      image: mainImage,
      images: imagesArr.length > 0 ? imagesArr : [mainImage],
      rating: Number(avgRating),
      reviews: p.reviews?.length || 0,
      stock: p.stockQTY,
      badge: discountText ? "discount" : "new",
      discount: discountText,
    };

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    next(error);
  }
};

// ===================================================
// DELETE PRODUCT
// DELETE /api/v1/admin/products/:id
// ===================================================
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    next(error);
  }
};
