const prisma = require('../prismaClient');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

// Helper to normalize array inputs
const toArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return [val];
};

// ===================================================
// CREATE PRODUCT
// POST /api/v1/products
// ===================================================
const createProduct = async (req, res) => {
    console.log('👉 createProduct payload →', req.body);

    const {
        name,
        title,
        brand,
        description,
        mrp,
        sellingPrice,
        onOffer,
        offerPrice,
        category,
        ageGroup,
        stockQTY,
        metaTitle,
        metaDescription,
        metaKeywords,
        imageUrl,
        images,
        attributes
    } = req.body;

    if (!name || !description || mrp === undefined || sellingPrice === undefined) {
        throw new ApiError(400, 'Name, description, MRP, and selling price are required.');
    }

    const newProduct = await prisma.product.create({
        data: {
            name,
            title: title || null,
            brand: brand || null,
            description,
            mrp: parseFloat(mrp),
            sellingPrice: parseFloat(sellingPrice),
            onOffer: Boolean(onOffer),
            offerPrice: offerPrice !== undefined && offerPrice !== null ? parseFloat(offerPrice) : null,
            category: category || null,
            ageGroup: ageGroup || null,
            stockQTY: stockQTY ? parseInt(stockQTY, 10) : 0,
            metaTitle: metaTitle || null,
            metaDescription: metaDescription || null,
            metaKeywords: toArray(metaKeywords),
            imageUrl: toArray(imageUrl),
            images: toArray(images),
            attributes: Array.isArray(attributes) && attributes.length > 0 ? {
                create: attributes
                    .filter(attr => attr && attr.attributeName && attr.attributeValue)
                    .map(attr => ({
                        attributeName: String(attr.attributeName),
                        attributeValue: String(attr.attributeValue)
                    }))
            } : undefined
        },
        include: {
            attributes: true
        }
    });

    return res
        .status(201)
        .json(new ApiResponse(201, 'Product created successfully', newProduct));
};

// ===================================================
// GET ALL PRODUCTS
// GET /api/v1/products
// Supports: category, brand, ageGroup, search, pagination, sorting
// ===================================================
const getAllProducts = async (req, res) => {
    const {
        category,
        brand,
        ageGroup,
        onOffer,
        search,
        minPrice,
        maxPrice,
        page = 1,
        limit = 12,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNumber - 1) * take;

    // Filter conditions
    const where = {
        deletedAt: null,
        isActive: true
    };

    if (category) {
        where.category = { equals: category, mode: 'insensitive' };
    }

    if (brand) {
        where.brand = { equals: brand, mode: 'insensitive' };
    }

    if (ageGroup) {
        where.ageGroup = { equals: ageGroup, mode: 'insensitive' };
    }

    if (onOffer !== undefined) {
        where.onOffer = onOffer === 'true' || onOffer === true;
    }

    if (minPrice || maxPrice) {
        where.sellingPrice = {};
        if (minPrice) where.sellingPrice.gte = parseFloat(minPrice);
        if (maxPrice) where.sellingPrice.lte = parseFloat(maxPrice);
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { brand: { contains: search, mode: 'insensitive' } },
            { title: { contains: search, mode: 'insensitive' } }
        ];
    }

    // Sorting
    const allowedSortFields = ['createdAt', 'sellingPrice', 'name', 'aggregateRating'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take,
            orderBy: { [sortField]: order },
            include: {
                attributes: true,
                _count: {
                    select: { reviews: true }
                }
            }
        }),
        prisma.product.count({ where })
    ]);

    return res.status(200).json(new ApiResponse(200, 'Products fetched successfully', {
        products,
        pagination: {
            total: totalCount,
            page: pageNumber,
            limit: take,
            totalPages: Math.ceil(totalCount / take)
        }
    }));
};

// ===================================================
// GET PRODUCT BY ID
// GET /api/v1/products/:id
// ===================================================
const getProductById = async (req, res) => {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
        where: {
            id,
            deletedAt: null
        },
        include: {
            attributes: true,
            reviews: {
                where: { deletedAt: null },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!product) {
        throw new ApiError(404, `Product with id '${id}' not found`);
    }

    return res.status(200).json(new ApiResponse(200, 'Product details fetched successfully', product));
};

// ===================================================
// UPDATE PRODUCT
// PUT /api/v1/products/:id
// ===================================================
const updateProduct = async (req, res) => {
    const { id } = req.params;

    const existingProduct = await prisma.product.findFirst({
        where: { id, deletedAt: null }
    });

    if (!existingProduct) {
        throw new ApiError(404, `Product with id '${id}' not found`);
    }

    const {
        name,
        title,
        brand,
        description,
        mrp,
        sellingPrice,
        onOffer,
        offerPrice,
        category,
        ageGroup,
        stockQTY,
        isActive,
        metaTitle,
        metaDescription,
        metaKeywords,
        imageUrl,
        images,
        attributes
    } = req.body;

    const data = {};

    if (name !== undefined) data.name = name;
    if (title !== undefined) data.title = title;
    if (brand !== undefined) data.brand = brand;
    if (description !== undefined) data.description = description;
    if (mrp !== undefined) data.mrp = parseFloat(mrp);
    if (sellingPrice !== undefined) data.sellingPrice = parseFloat(sellingPrice);
    if (onOffer !== undefined) data.onOffer = Boolean(onOffer);
    if (offerPrice !== undefined) data.offerPrice = offerPrice !== null ? parseFloat(offerPrice) : null;
    if (category !== undefined) data.category = category;
    if (ageGroup !== undefined) data.ageGroup = ageGroup;
    if (stockQTY !== undefined) data.stockQTY = parseInt(stockQTY, 10);
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (metaTitle !== undefined) data.metaTitle = metaTitle;
    if (metaDescription !== undefined) data.metaDescription = metaDescription;
    if (metaKeywords !== undefined) data.metaKeywords = toArray(metaKeywords);
    if (imageUrl !== undefined) data.imageUrl = toArray(imageUrl);
    if (images !== undefined) data.images = toArray(images);

    // If attributes are updated, replace them
    if (Array.isArray(attributes)) {
        data.attributes = {
            deleteMany: {},
            create: attributes
                .filter(attr => attr && attr.attributeName && attr.attributeValue)
                .map(attr => ({
                    attributeName: String(attr.attributeName),
                    attributeValue: String(attr.attributeValue)
                }))
        };
    }

    const updatedProduct = await prisma.product.update({
        where: { id },
        data,
        include: {
            attributes: true
        }
    });

    return res.status(200).json(new ApiResponse(200, 'Product updated successfully', updatedProduct));
};

// ===================================================
// DELETE PRODUCT (Soft Delete)
// DELETE /api/v1/products/:id
// ===================================================
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    const existingProduct = await prisma.product.findFirst({
        where: { id, deletedAt: null }
    });

    if (!existingProduct) {
        throw new ApiError(404, `Product with id '${id}' not found`);
    }

    await prisma.product.update({
        where: { id },
        data: {
            deletedAt: new Date(),
            isActive: false
        }
    });

    return res.status(200).json(new ApiResponse(200, 'Product deleted successfully'));
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};