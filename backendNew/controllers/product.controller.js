import { prisma } from "../config/prisma.js";
import { logger } from "../utils/logger.js";

// ── Constants ────────────────────────────────────────────────────────────────
const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Sanitise an image value into a usable URL.
 * Handles raw strings, objects with `url` key, and protocol-less domains.
 */
const sanitiseImageUrl = (img) => {
    if (typeof img !== "string") return img?.url || "";
    const trimmed = img.trim();
    if (!trimmed) return "";
    if (/^(https?:|data:|\/)/i.test(trimmed)) return trimmed;
    if (trimmed.includes(".")) return `https://${trimmed}`;
    return FALLBACK_IMAGE;
};

/**
 * Compute a discount label (e.g. "12%") from pricing fields.
 */
const computeDiscountText = (discount, originalPrice, sellingPrice) => {
    if (discount > 0) return `${discount}%`;
    if (originalPrice > sellingPrice) {
        return `${Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)}%`;
    }
    return null;
};

/**
 * Map a raw Prisma product record into the storefront response shape.
 */
const formatProductForStorefront = (p) => {
    const imagesArr = Array.isArray(p.images)
        ? p.images.map(sanitiseImageUrl).filter(Boolean)
        : [];
    const mainImage = imagesArr[0] || FALLBACK_IMAGE;

    const avgRating =
        p.reviews?.length > 0
            ? (p.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / p.reviews.length).toFixed(1)
            : "4.8";

    const effectivePrice    = p.sellingPrice ?? p.price;
    const effectiveOriginal = p.mrp ?? p.price;
    const discountText      = computeDiscountText(p.discount, effectiveOriginal, effectivePrice);

    return {
        ...p,
        id:             p.id,
        name:           p.name,
        title:          p.title || p.name,
        brand_id:       p.brand_id,
        brand:          p.brand?.name || "ToyCulture",
        brandObj:       p.brand || null,
        category_id:    p.category_id,
        category:       p.category?.name || "Toys",
        categoryObj:    p.category || null,
        parentCategory: p.category?.parent?.name || null,
        price:          effectivePrice,
        originalPrice:  effectiveOriginal > effectivePrice ? effectiveOriginal : null,
        image:          mainImage,
        images:         imagesArr.length > 0 ? imagesArr : [mainImage],
        rating:         Number(avgRating),
        reviews:        p.reviews?.length || 0,
        stock:          p.stockQTY,
        inStock:        (p.stockQTY ?? 0) > 0,
        badge:          discountText ? "discount" : "new",
        discount:       discountText,
    };
};

/** Common Prisma includes for storefront queries. */
const STOREFRONT_INCLUDES = {
    brand:      true,
    category:   { include: { parent: true } },
    attributes: true,
    reviews:    true,
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET ALL PRODUCTS  — GET /api/v1/products
// ═══════════════════════════════════════════════════════════════════════════════
export const getAllProducts = async (req, res, next) => {
    try {
        const { category, brand, search, sort, order, page, limit: rawLimit } = req.query;

        // ── Build filter ─────────────────────────────────────────────────
        const where = { is_active: true };

        if (category) {
            where.category = { name: { equals: category, mode: "insensitive" } };
        }
        if (brand) {
            where.brand = { name: { equals: brand, mode: "insensitive" } };
        }
        if (search) {
            where.OR = [
                { name:        { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        // ── Sorting & pagination ─────────────────────────────────────────
        const pageNum  = Math.max(Number(page) || 1, 1);
        const limitNum = Math.min(Math.max(Number(rawLimit) || 20, 1), 100);
        const sortField = ["price", "name", "createdAt"].includes(sort) ? sort : "createdAt";
        const sortOrder = order === "asc" ? "asc" : "desc";

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include:  STOREFRONT_INCLUDES,
                orderBy:  { [sortField]: sortOrder },
                skip:     limitNum * (pageNum - 1),
                take:     limitNum,
            }),
            prisma.product.count({ where }),
        ]);

        const formatted = products.map(formatProductForStorefront);

        return res.status(200).json({
            success: true,
            data:    formatted,
            total,
            page:    pageNum,
            pages:   Math.ceil(total / limitNum),
            limit:   limitNum,
        });
    } catch (error) {
        logger.error("getAllProducts failed:", error.message);
        next(error);
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET SINGLE PRODUCT  — GET /api/v1/products/:id
// ═══════════════════════════════════════════════════════════════════════════════
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where:   { id },
            include: STOREFRONT_INCLUDES,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            data:    formatProductForStorefront(product),
        });
    } catch (error) {
        logger.error("getProductById failed:", error.message);
        next(error);
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CREATE PRODUCT — POST /api/v1/products
// ═══════════════════════════════════════════════════════════════════════════════
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

        const toArray = (val) => (!val ? [] : Array.isArray(val) ? val : [val]);
        const rawImages = [...toArray(images), ...toArray(imageUrl)].filter(Boolean);

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
                category: { include: { parent: true } },
                attributes: true,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: newProduct,
        });
    } catch (error) {
        logger.error("createProduct failed:", error.message);
        next(error);
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// UPDATE PRODUCT — PUT/PATCH /api/v1/products/:id
// ═══════════════════════════════════════════════════════════════════════════════
export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
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
            is_active,
        } = req.body;

        const toArray = (val) => (!val ? [] : Array.isArray(val) ? val : [val]);

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (title !== undefined) updateData.title = title ? title.trim() : null;
        if (description !== undefined) updateData.description = description.trim();
        if (small_description !== undefined) updateData.small_description = small_description.trim();
        if (mrp !== undefined) updateData.mrp = parseFloat(mrp) || 0;
        if (sellingPrice !== undefined) updateData.sellingPrice = parseFloat(sellingPrice) || 0;
        if (price !== undefined) updateData.price = parseFloat(price) || 0;
        if (onOffer !== undefined) updateData.onOffer = Boolean(onOffer);
        if (offerPrice !== undefined) updateData.offerPrice = offerPrice !== "" && offerPrice !== null ? parseFloat(offerPrice) : null;
        if (ageGroup !== undefined) updateData.ageGroup = ageGroup || null;
        if (stockQTY !== undefined) updateData.stockQTY = parseInt(stockQTY, 10) || 0;
        if (metaTitle !== undefined) updateData.metaTitle = metaTitle || null;
        if (metaDescription !== undefined) updateData.metaDescription = metaDescription || null;
        if (is_active !== undefined) updateData.is_active = Boolean(is_active);

        if (metaKeywords !== undefined) {
            updateData.metaKeywords = toArray(metaKeywords).map((k) => String(k).trim()).filter(Boolean);
        }

        if (images !== undefined || imageUrl !== undefined) {
            updateData.images = [...toArray(images), ...toArray(imageUrl)].filter(Boolean);
        }

        const chosenBrandId = brand_id || brandId;
        if (chosenBrandId) {
            updateData.brand = { connect: { id: chosenBrandId } };
        } else if (brand && String(brand).trim()) {
            updateData.brand = {
                connectOrCreate: {
                    where: { name: String(brand).trim() },
                    create: { name: String(brand).trim() },
                },
            };
        }

        const chosenCategoryId = category_id || categoryId;
        if (chosenCategoryId) {
            updateData.category = { connect: { id: chosenCategoryId } };
        } else if (category && String(category).trim()) {
            updateData.category = {
                connectOrCreate: {
                    where: { name: String(category).trim() },
                    create: { name: String(category).trim() },
                },
            };
        }

        // Run in transaction if attributes need replacement
        const updated = await prisma.$transaction(async (tx) => {
            if (Array.isArray(attributes)) {
                await tx.attribute.deleteMany({ where: { productId: id } });
                const validAttributes = attributes
                    .filter((attr) => attr && attr.attributeName && attr.attributeValue)
                    .map((attr) => ({
                        productId: id,
                        attributeName: String(attr.attributeName).trim(),
                        attributeValue: String(attr.attributeValue).trim(),
                    }));
                if (validAttributes.length > 0) {
                    await tx.attribute.createMany({ data: validAttributes });
                }
            }

            return tx.product.update({
                where: { id },
                data: updateData,
                include: {
                    brand: true,
                    category: { include: { parent: true } },
                    attributes: true,
                },
            });
        });

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updated,
        });
    } catch (error) {
        logger.error("updateProduct failed:", error.message);
        next(error);
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE PRODUCT — DELETE /api/v1/products/:id
// ═══════════════════════════════════════════════════════════════════════════════
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // If product has been ordered, soft-delete to preserve order history
        const hasOrders = await prisma.orderItem.count({ where: { product_id: id } });
        if (hasOrders > 0) {
            await prisma.product.update({
                where: { id },
                data:  { is_active: false, deletedAt: new Date() },
            });
            return res.status(200).json({
                success: true,
                message: "Product archived successfully (preserved for order history)",
            });
        }

        await prisma.$transaction(async (tx) => {
            await tx.attribute.deleteMany({ where: { productId: id } });
            await tx.productVariant.deleteMany({ where: { product_id: id } });
            await tx.cartItem.deleteMany({ where: { product_id: id } });
            await tx.wishlistItem.deleteMany({ where: { product_id: id } });
            await tx.review.deleteMany({ where: { product_id: id } });
            await tx.product.delete({ where: { id } });
        });

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        logger.error("deleteProduct failed:", error.message);
        next(error);
    }
};
