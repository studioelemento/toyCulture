import { prisma } from "../../config/prisma.js";

export const addBrandService = async (value) => {
    const existingBrand = await prisma.brand.findFirst({
        where: { name: { equals: value.name, mode: "insensitive" } },
    });
    if (existingBrand) {
        const err = new Error("Brand name already exists");
        err.status = 409;
        throw err;
    }
    const brand = await prisma.brand.create({ data: value });
    return brand;
};

export const getAllBrandService = async (query) => {
    const limit = Number(query.limit) || 50;
    const page = Number(query.page) || 1;
    const search = query.search || "";

    const where = {};
    if (search) {
        where.name = { contains: search, mode: "insensitive" };
    }

    const [data, total] = await Promise.all([
        prisma.brand.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: limit * (page - 1),
            take: limit,
        }),
        prisma.brand.count({ where }),
    ]);

    return {
        data,
        page,
        pages: Math.ceil(total / limit),
        limit,
        total,
    };
};

export const getBrandService = async (id) => {
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) {
        throw new Error("No brand found");
    }
    return brand;
};

export const editBrandService = async (id, data) => {
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new Error("No brand Found");

    const existingWithName = await prisma.brand.findFirst({
        where: {
            name: { equals: data.name, mode: "insensitive" },
            NOT: { id },
        },
    });
    if (existingWithName) throw new Error("Brand name already exists");

    const updated = await prisma.brand.update({
        where: { id },
        data: {
            name: data.name,
            seo_title: data.seo_title || null,
            seo_description: data.seo_description || null,
        },
    });

    return updated;
};

export const toggleBrandService = async (id) => {
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new Error("Brand not found");

    const updated = await prisma.brand.update({
        where: { id },
        data: { is_active: !brand.is_active },
    });
    return updated;
};
