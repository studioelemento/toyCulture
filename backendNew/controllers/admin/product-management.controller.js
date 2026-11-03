import {
    getAllProductService,
    getProductService,
    createProductService,
    editProductService,
    toggleProductService,
    deleteProductService,
} from "../../services/admin/product-management.service.js";
import { productValidator } from "../../validators/productValidator.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";
import { logger } from "../../utils/logger.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL PRODUCTS  — GET /api/admin/products
// ─────────────────────────────────────────────────────────────────────────────
export const getAllProducts = async (req, res, next) => {
    try {
        const result = await getAllProductService(req.query);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        logger.error("Admin getAllProducts failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET SINGLE PRODUCT  — GET /api/admin/products/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getProduct = async (req, res, next) => {
    try {
        const product = await getProductService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data:    product,
        });
    } catch (error) {
        logger.error("Admin getProduct failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE PRODUCT  — POST /api/admin/products
// ─────────────────────────────────────────────────────────────────────────────
export const addProduct = async (req, res, next) => {
    try {
        const parsedBody = {
            ...req.body,
            variants: JSON.parse(req.body.variants || "[]"),
        };
        const { value, error } = productValidator(parsedBody);

        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }
        if (!req.files || req.files.length < 1) {
            throw new ErrorWithStatus("At least 1 product image is required", HTTP_RES.BAD_REQUEST);
        }

        const product = await createProductService(value, req);
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data:    product,
        });
    } catch (error) {
        logger.error("Admin addProduct failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// EDIT PRODUCT  — PUT|PATCH /api/admin/products/:id
// ─────────────────────────────────────────────────────────────────────────────
export const editProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const parsedBody = {
            ...req.body,
            variants: JSON.parse(req.body.variants || "[]"),
        };
        const { value, error } = productValidator(parsedBody);

        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }

        const product = await editProductService(id, value, req);
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data:    product,
        });
    } catch (error) {
        logger.error("Admin editProduct failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE PRODUCT STATUS  — PATCH /api/admin/products/toggle-status/:id
// ─────────────────────────────────────────────────────────────────────────────
export const toggleProduct = async (req, res, next) => {
    try {
        const result = await toggleProductService(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Product ${result.is_active ? "activated" : "deactivated"} successfully`,
            data:    result,
        });
    } catch (error) {
        logger.error("Admin toggleProduct failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE PRODUCT  — DELETE /api/admin/products/:id
// ─────────────────────────────────────────────────────────────────────────────
export const deleteProduct = async (req, res, next) => {
    try {
        const result = await deleteProductService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data:    result,
        });
    } catch (error) {
        logger.error("Admin deleteProduct failed:", error.message);
        next(error);
    }
};