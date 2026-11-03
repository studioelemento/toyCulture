import { prisma } from "../../config/prisma.js";
import cloudinary, { uploadImages } from "../../utils/cloudinary.js";
import { generateSKU } from "../../utils/generateSKU.js";
import { logger } from "../../utils/logger.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL PRODUCTS  (admin — paginated, searchable, filterable)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllProductService = async (query) => {
    const limit  = Math.min(Number(query.limit) || 10, 100);
    const page   = Math.max(Number(query.page)  || 1, 1);
    const search = query.search?.trim() || "";
    const filter = query.filter || "AllProduct"; // AllProduct | isActive | isInActive
    const sortBy = query.sort  || "createdAt";
    const order  = query.order === "asc" ? "asc" : "desc";

    // Build where clause
    const where = { deletedAt: null };

    if (filter === "isActive")   where.is_active = true;
    if (filter === "isInActive") where.is_active = false;

    if (search) {
        where.OR = [
            { name:        { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    const [data, total, totalActive, totalBlocked] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                brand:    { select: { id: true, name: true } },
                category: { select: { id: true, name: true, parent: { select: { id: true, name: true } } } },
                variants: { where: { deletedAt: null }, select: { id: true, sku: true, color: true, size: true, stock: true, is_active: true } },
                attributes: true,
            },
            orderBy: { [sortBy]: order },
            skip:  limit * (page - 1),
            take:  limit,
        }),
        prisma.product.count({ where }),
        prisma.product.count({ where: { deletedAt: null, is_active: true } }),
        prisma.product.count({ where: { deletedAt: null, is_active: false } }),
    ]);

    return {
        data,
        page,
        pages: Math.ceil(total / limit),
        limit,
        total,
        total_products: total,
        blocked_products: totalBlocked,
        active_products: totalActive,
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET SINGLE PRODUCT  (admin — full detail with Cloudinary URLs)
// ─────────────────────────────────────────────────────────────────────────────
export const getProductService = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id, deletedAt: null },
        include: {
            brand:      { select: { id: true, name: true, seo_title: true } },
            category:   { include: { parent: true } },
            variants:   { where: { deletedAt: null } },
            attributes: true,
        },
    });

    if (!product) {
        const err = new Error("Product not found");
        err.status = 404;
        throw err;
    }

    // Resolve Cloudinary public_ids to full secure URLs
    const images = (Array.isArray(product.images) ? product.images : []).map((img) => {
        if (typeof img === "string") {
            return { url: img.startsWith("http") ? img : cloudinary.url(img, { secure: true }), is_main: false };
        }
        return { url: img?.url?.startsWith("http") ? img.url : cloudinary.url(img?.url ?? "", { secure: true }), is_main: img?.is_main ?? false };
    });

    return { ...product, images };
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE PRODUCT  (Prisma + Cloudinary upload)
// ─────────────────────────────────────────────────────────────────────────────
export const createProductService = async (data, req) => {
    const { variants = [], attributes = [], ...productData } = data;

    // Upload images to Cloudinary
    const uploadedUrls = await uploadImages(req, "product");
    const images = uploadedUrls.map((url, i) => ({ url, is_main: i === 0 }));

    // Check for duplicate name
    const existing = await prisma.product.findFirst({
        where: { name: { equals: productData.name, mode: "insensitive" }, deletedAt: null },
    });
    if (existing) {
        const err = new Error("A product with this name already exists");
        err.status = 409;
        throw err;
    }

    const created = await prisma.$transaction(async (tx) => {
        const prod = await tx.product.create({
            data: {
                ...productData,
                images,
                variants: {
                    create: variants.map((v) => ({
                        sku:   generateSKU(null, v.size, v.color),
                        size:  v.size  || null,
                        color: v.color || null,
                        stock: Number(v.stock) || 0,
                    })),
                },
                attributes: Array.isArray(attributes) && attributes.length > 0
                    ? {
                        create: attributes
                            .filter((a) => a?.attributeName && a?.attributeValue)
                            .map((a) => ({
                                attributeName:  String(a.attributeName).trim(),
                                attributeValue: String(a.attributeValue).trim(),
                            })),
                    }
                    : undefined,
            },
            include: { variants: true, attributes: true },
        });

        // Update variant SKUs with the real product ID
        await Promise.all(
            prod.variants.map((variant, idx) =>
                tx.productVariant.update({
                    where: { id: variant.id },
                    data:  { sku: generateSKU(prod.id, variants[idx]?.size, variants[idx]?.color) },
                })
            )
        );

        return tx.product.findUnique({
            where: { id: prod.id },
            include: {
                brand:      true,
                category:   { include: { parent: true } },
                variants:   true,
                attributes: true,
            },
        });
    });

    return created;
};

// ─────────────────────────────────────────────────────────────────────────────
// EDIT PRODUCT  (Prisma — update details, variants, attributes, images)
// ─────────────────────────────────────────────────────────────────────────────
export const editProductService = async (id, data, req) => {
    const product = await prisma.product.findUnique({ where: { id, deletedAt: null } });
    if (!product) {
        const err = new Error("Product not found");
        err.status = 404;
        throw err;
    }

    // Duplicate name check (exclude current product)
    if (data.name) {
        const nameConflict = await prisma.product.findFirst({
            where: {
                name:      { equals: data.name, mode: "insensitive" },
                deletedAt: null,
                NOT: { id },
            },
        });
        if (nameConflict) {
            const err = new Error("A product with this name already exists");
            err.status = 409;
            throw err;
        }
    }

    // Process image data (mix of existing public_ids and new uploads)
    let updatedImages = Array.isArray(product.images) ? product.images : [];
    if (data.imagesData) {
        const imagesData  = data.imagesData.map((x) => (typeof x === "string" ? JSON.parse(x) : x));
        const uploadUrls  = await uploadImages(req, "product");
        const newEntries  = imagesData.filter((x) => x.is_new);

        if (uploadUrls.length !== newEntries.length) {
            throw new Error("Image count mismatch between uploaded files and metadata");
        }

        let uploadIdx = 0;
        updatedImages = imagesData.map((x, i) => {
            if (x.is_new) return { url: uploadUrls[uploadIdx++], is_main: i === 0 };
            return Array.isArray(product.images) ? (product.images[i] ?? x) : x;
        });
    }

    const { variants = [], attributes, imagesData: _ignored, ...productFields } = data;

    const updated = await prisma.$transaction(async (tx) => {
        // Update product core fields
        await tx.product.update({
            where: { id },
            data: {
                ...productFields,
                images: updatedImages,
            },
        });

        // Sync variants
        if (variants.length > 0) {
            const existingVariants = await tx.productVariant.findMany({ where: { product_id: id, deletedAt: null } });
            const existingIds      = existingVariants.map((v) => v.id);
            const incomingIds      = variants.filter((v) => v.id).map((v) => v.id);

            // Soft-delete removed variants
            const toDelete = existingIds.filter((eid) => !incomingIds.includes(eid));
            if (toDelete.length > 0) {
                await tx.productVariant.updateMany({
                    where: { id: { in: toDelete } },
                    data:  { deletedAt: new Date() },
                });
            }

            // Upsert each variant
            await Promise.all(
                variants.map((v) => {
                    if (v.id) {
                        return tx.productVariant.update({
                            where: { id: v.id },
                            data:  { color: v.color || null, size: v.size || null, stock: Number(v.stock) || 0 },
                        });
                    } else {
                        return tx.productVariant.create({
                            data: {
                                product_id: id,
                                sku:        generateSKU(id, v.size, v.color),
                                color:      v.color || null,
                                size:       v.size  || null,
                                stock:      Number(v.stock) || 0,
                            },
                        });
                    }
                })
            );
        }

        // Sync attributes — replace strategy (delete all → re-create)
        if (attributes !== undefined) {
            await tx.attribute.deleteMany({ where: { productId: id } });
            if (Array.isArray(attributes) && attributes.length > 0) {
                await tx.attribute.createMany({
                    data: attributes
                        .filter((a) => a?.attributeName && a?.attributeValue)
                        .map((a) => ({
                            productId:      id,
                            attributeName:  String(a.attributeName).trim(),
                            attributeValue: String(a.attributeValue).trim(),
                        })),
                });
            }
        }

        return tx.product.findUnique({
            where: { id },
            include: {
                brand:      true,
                category:   { include: { parent: true } },
                variants:   { where: { deletedAt: null } },
                attributes: true,
            },
        });
    });

    return updated;
};

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE PRODUCT STATUS  (Prisma)
// ─────────────────────────────────────────────────────────────────────────────
export const toggleProductService = async (id) => {
    const product = await prisma.product.findUnique({ where: { id, deletedAt: null } });
    if (!product) {
        const err = new Error("Product not found");
        err.status = 404;
        throw err;
    }

    return prisma.product.update({
        where: { id },
        data:  { is_active: !product.is_active },
        select: { id: true, name: true, is_active: true },
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// SOFT-DELETE PRODUCT  (Prisma)
// ─────────────────────────────────────────────────────────────────────────────
export const deleteProductService = async (id) => {
    const product = await prisma.product.findUnique({ where: { id, deletedAt: null } });
    if (!product) {
        const err = new Error("Product not found");
        err.status = 404;
        throw err;
    }

    return prisma.product.update({
        where: { id },
        data:  { deletedAt: new Date(), is_active: false },
        select: { id: true, name: true },
    });
};
