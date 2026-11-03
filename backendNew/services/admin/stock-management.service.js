import { prisma } from "../../config/prisma.js";

const FILTER_OPTIONS = {
    lowStock: { stock: { lt: 10 } },
};

export const getAllProductsStockService = async (query) => {
    const limit     = Math.min(Number(query.limit) || 10, 100);
    const page      = Math.max(Number(query.page)  || 1, 1);
    const search    = query.search?.trim() || "";
    const sortField = query.sort || "createdAt";
    const order     = query.order === "desc" ? "desc" : "asc";
    const filter    = FILTER_OPTIONS[query.filter] || {};

    const where = {
        deletedAt: null,
        ...filter,
    };

    if (search) {
        where.OR = [
            { sku: { contains: search, mode: "insensitive" } },
            { product: { name: { contains: search, mode: "insensitive" } } },
            { product: { category: { name: { contains: search, mode: "insensitive" } } } },
        ];
    }

    const [variants, totalVariants] = await Promise.all([
        prisma.productVariant.findMany({
            where,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        discount: true,
                        images: true,
                        stockQTY: true,
                        category: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: sortField === "stock" ? { stock: order } : { createdAt: order },
            skip: limit * (page - 1),
            take: limit,
        }),
        prisma.productVariant.count({ where }),
    ]);

    // If variants exist, return them formatted
    if (totalVariants > 0) {
        const data = variants.map((v) => {
            const rawImages = Array.isArray(v.product?.images) ? v.product.images : [];
            const firstImg = rawImages[0];
            const imageUrl = typeof firstImg === "string" ? firstImg : firstImg?.url || "";

            return {
                id:            v.id,
                _id:           v.id,
                variant_sku:   v.sku,
                stock:         v.stock,
                size:          v.size,
                color:         v.color,
                is_active:     v.is_active,
                price:         v.product?.price ?? 0,
                discount:      v.product?.discount ?? 0,
                product_name:  v.product?.name ?? "Unknown Product",
                category_name: v.product?.category?.name ?? "General",
                image:         imageUrl,
                createdAt:     v.createdAt,
            };
        });

        return {
            data,
            page,
            limit,
            total: totalVariants,
            pages: Math.ceil(totalVariants / limit),
        };
    }

    // Fallback: If products have no variants, list products directly as stock items
    const prodWhere = { deletedAt: null };
    if (query.filter === "lowStock") {
        prodWhere.stockQTY = { lt: 10 };
    }
    if (search) {
        prodWhere.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { category: { name: { contains: search, mode: "insensitive" } } },
        ];
    }

    const [products, totalProducts] = await Promise.all([
        prisma.product.findMany({
            where: prodWhere,
            include: { category: { select: { id: true, name: true } } },
            orderBy: sortField === "stock" ? { stockQTY: order } : { createdAt: order },
            skip: limit * (page - 1),
            take: limit,
        }),
        prisma.product.count({ where: prodWhere }),
    ]);

    const data = products.map((p) => {
        const rawImages = Array.isArray(p.images) ? p.images : [];
        const firstImg = rawImages[0];
        const imageUrl = typeof firstImg === "string" ? firstImg : firstImg?.url || "";

        return {
            id:            p.id,
            _id:           p.id,
            variant_sku:   `SKU-${p.id.slice(0, 8).toUpperCase()}`,
            stock:         p.stockQTY,
            size:          null,
            color:         null,
            is_active:     p.is_active,
            price:         p.price,
            discount:      p.discount,
            product_name:  p.name,
            category_name: p.category?.name ?? "General",
            image:         imageUrl,
            createdAt:     p.createdAt,
        };
    });

    return {
        data,
        page,
        limit,
        total: totalProducts,
        pages: Math.ceil(totalProducts / limit),
    };
};
