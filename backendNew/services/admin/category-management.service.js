import { prisma } from "../../config/prisma.js";

export const addCategoryService = async (value) => {
    const existingCategory = await prisma.category.findFirst({
        where: { name: { equals: value.name, mode: "insensitive" } },
    });
    if (existingCategory) {
        const err = new Error("Category name already exists");
        err.status = 409;
        throw err;
    }

    // If parent_id is provided, verify parent exists
    if (value.parent_id) {
        const parent = await prisma.category.findUnique({
            where: { id: value.parent_id },
        });
        if (!parent) throw new Error("Parent category not found");
    }

    const category = await prisma.category.create({
        data: {
            name: value.name,
            parent_id: value.parent_id || null,
            seo_description: value.seo_description || null,
        },
        include: { parent: true },
    });

    return category;
};

export const getAllCategoriesService = async (query) => {
    const limit = Number(query.limit) || 50;
    const page = Number(query.page) || 1;
    const search = query.search || "";

    const where = {};
    if (search) {
        where.name = { contains: search, mode: "insensitive" };
    }

    const [data, total] = await Promise.all([
        prisma.category.findMany({
            where,
            include: {
                parent: true,
                children: {
                    where: { deletedAt: null },
                    orderBy: { name: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: limit * (page - 1),
            take: limit,
        }),
        prisma.category.count({ where }),
    ]);

    return {
        data,
        page,
        pages: Math.ceil(total / limit),
        limit,
        total,
    };
};

export const getCategoryService = async (id) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: { parent: true, children: true },
    });
    if (!category) {
        throw new Error("No Category found");
    }
    return category;
};

export const editCategoryService = async (id, data) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
        const err = new Error("No Category Found");
        err.status = 404;
        throw err;
    }

    const existingWithName = await prisma.category.findFirst({
        where: {
            name: { equals: data.name, mode: "insensitive" },
            NOT: { id },
        },
    });
    if (existingWithName) {
        const err = new Error("Category name already exists");
        err.status = 409;
        throw err;
    }

    // Prevent setting parent_id to self
    if (data.parent_id && data.parent_id === id) {
        throw new Error("Category cannot be its own parent");
    }

    const updated = await prisma.category.update({
        where: { id },
        data: {
            name: data.name,
            parent_id: data.parent_id || null,
            seo_description: data.seo_description || null,
        },
        include: { parent: true, children: true },
    });

    return updated;
};

export const toggleCategoryService = async (id) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
        const err = new Error("Category not found");
        err.status = 404;
        throw err;
    }

    const updated = await prisma.category.update({
        where: { id },
        data: { is_active: !category.is_active },
    });
    return updated;
};
