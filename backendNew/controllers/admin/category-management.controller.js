import {
    addCategoryService,
    editCategoryService,
    getAllCategoriesService,
    getCategoryService,
    toggleCategoryService,
} from "../../services/admin/category-management.service.js";
import { categoryValidator } from "../../validators/categoryValidator.js";

export const addCategory = async (req, res, next) => {
    try {
        const { value, error } = categoryValidator(req.body);
        if (error) {
            res.status(400);
            throw error;
        }
        const category = await addCategoryService(value);
        res.status(201).json({
            message: "Category created successfully",
            data: category,
            status: "success",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCategories = async (req, res, next) => {
    try {
        const query = req.query;
        const categoriesRes = await getAllCategoriesService(query);
        res.status(200).json(categoriesRes);
    } catch (error) {
        next(error);
    }
};

export const getCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await getCategoryService(id);
        res.status(200).json({
            message: "Category found successfully",
            data: category,
            status: "success",
        });
    } catch (error) {
        next(error);
    }
};

export const editCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { value, error } = categoryValidator(req.body);
        if (error) {
            res.status(400);
            throw error;
        }
        const category = await editCategoryService(id, value);
        res.status(200).json({
            message: "Category edited successfully",
            data: category,
            status: "success",
        });
    } catch (error) {
        next(error);
    }
};

export const toggleCategoryStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await toggleCategoryService(id);
        res.status(200).json({
            message: "Category toggled successfully",
            data: category,
            status: "success",
        });
    } catch (error) {
        next(error);
    }
};
