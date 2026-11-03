import { prisma } from "../config/prisma.js";
import cloudinary from "../utils/cloudinary.js";

const formatProductImages = (images) => {
    if (!Array.isArray(images)) return [];
    return images.map((img, idx) => {
        const rawUrl = typeof img === "string" ? img : img?.url || "";
        let secureUrl = rawUrl;
        if (rawUrl && !rawUrl.startsWith("http") && !rawUrl.startsWith("data:")) {
            try {
                secureUrl = cloudinary.url(rawUrl, { secure: true });
            } catch {
                secureUrl = rawUrl;
            }
        }
        return {
            is_main: idx === 0,
            url:     secureUrl,
        };
    });
};

export const getHomeDataService = async (user) => {
    const userId = user?.id || null;

    // Fetch user wishlist product IDs if logged in
    let wishlistedIds = new Set();
    if (userId) {
        const wishlists = await prisma.wishlistItem.findMany({
            where:  { user_id: userId },
            select: { product_id: true },
        });
        wishlistedIds = new Set(wishlists.map((w) => w.product_id));
    }

    // 1. New Arrivals: 8 newest active products
    const newArrivalsRaw = await prisma.product.findMany({
        where:   { is_active: true, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take:    8,
        include: {
            brand:    { select: { name: true } },
            category: { select: { name: true } },
        },
    });

    const new_arrivals = newArrivalsRaw.map((p) => ({
        ...p,
        _id:          p.id,
        isWishlisted: wishlistedIds.has(p.id),
        images:       formatProductImages(p.images),
        brand_name:   p.brand?.name || "ToyCulture",
        category_name: p.category?.name || "Toys",
    }));

    // 2. Top Selling (or on offer deals)
    const topSellingRaw = await prisma.product.findMany({
        where:   { is_active: true, deletedAt: null },
        orderBy: [{ discount: "desc" }, { createdAt: "asc" }],
        take:    8,
        include: {
            brand:    { select: { name: true } },
            category: { select: { name: true } },
        },
    });

    const top_selling = topSellingRaw.map((p) => ({
        ...p,
        _id:          p.id,
        isWishlisted: wishlistedIds.has(p.id),
        images:       formatProductImages(p.images),
        brand_name:   p.brand?.name || "ToyCulture",
        category_name: p.category?.name || "Toys",
    }));

    return [
        {
            new_arrivals,
            top_selling,
        },
    ];
};

export const getSearchDataService = async (query = {}, user = null) => {
    const userId   = user?.id || null;
    const page     = Math.max(Number(query.page) || 1, 1);
    const limit    = Math.min(Number(query.limit) || 12, 50);
    const search   = query.search?.trim() || "";
    const category = query.category?.trim();
    const brand    = query.brand?.trim();
    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 100000;
    const sortField = query.sort || "createdAt";
    const sortOrder = query.order === "asc" ? "asc" : "desc";

    const where = {
        is_active: true,
        deletedAt: null,
        price: { gte: minPrice, lte: maxPrice },
    };

    if (search) {
        where.OR = [
            { name:        { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    if (category) {
        where.category = { name: { equals: category, mode: "insensitive" } };
    }

    if (brand) {
        where.brand = { name: { equals: brand, mode: "insensitive" } };
    }

    let wishlistedIds = new Set();
    if (userId) {
        const wishlists = await prisma.wishlistItem.findMany({
            where:  { user_id: userId },
            select: { product_id: true },
        });
        wishlistedIds = new Set(wishlists.map((w) => w.product_id));
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                brand:      { select: { name: true } },
                category:   { select: { name: true } },
                attributes: true,
            },
            orderBy: sortField === "price" ? { price: sortOrder } : { createdAt: sortOrder },
            skip:    limit * (page - 1),
            take:    limit,
        }),
        prisma.product.count({ where }),
    ]);

    const formattedData = products.map((p) => ({
        ...p,
        _id:          p.id,
        isWishlisted: wishlistedIds.has(p.id),
        images:       formatProductImages(p.images),
        brand_name:   p.brand?.name || "ToyCulture",
        category_name: p.category?.name || "Toys",
    }));

    return {
        data:        formattedData,
        total,
        page,
        totalPages:  Math.ceil(total / limit),
        limit,
    };
};

export const getProductDataService = async (productId) => {
    const product = await prisma.product.findUnique({
        where:   { id: productId },
        include: {
            brand:      true,
            category:   { include: { parent: true } },
            attributes: true,
            variants:   true,
            reviews:    { include: { user: { select: { first_name: true, last_name: true } } } },
        },
    });

    if (!product || !product.is_active || product.deletedAt) {
        const err = new Error("Product not found or inactive");
        err.status = 404;
        throw err;
    }

    // Related products in the same category
    const related = await prisma.product.findMany({
        where: {
            category_id: product.category_id,
            id:          { not: product.id },
            is_active:   true,
            deletedAt:   null,
        },
        take: 4,
    });

    return {
        ...product,
        _id:      product.id,
        images:   formatProductImages(product.images),
        products: related.map((r) => ({
            ...r,
            _id:    r.id,
            images: formatProductImages(r.images),
        })),
    };
};
