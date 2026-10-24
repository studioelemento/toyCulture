import {
    addBrandService,
    editBrandService,
    getAllBrandService,
    getBrandService,
    toggleBrandService,
} from "../../services/admin/brand-management.service.js";
import { brandValidator } from "../../validators/brandValidator.js";

export const addBrand = async (req, res, next) => {
    try {
        const { error, value } = brandValidator(req.body);
        if (error) {
            res.status(400);
            throw error;
        }
        const brand = await addBrandService(value);
        res.status(201).json({
            message: "Brand created successfully",
            data: brand,
            status: "success",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllBrand = async (req, res, next) => {
    try {
        const query = req.query;
        const brandRes = await getAllBrandService(query);
        res.status(200).json(brandRes);
    } catch (error) {
        next(error);
    }
};

export const getBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        const brand = await getBrandService(id);
        res.status(200).json({
            message: "Brand found successfully",
            data: brand,
            status: "success",
        });
    } catch (error) {
        next(error);
    }
};

export const editBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { value, error } = brandValidator(req.body);
        if (error) {
            res.status(400);
            throw error;
        }
        const brand = await editBrandService(id, value);
        res.status(200).json({
            message: "Brand edited successfully",
            data: brand,
            status: "success",
        });
    } catch (error) {
        next(error);
    }
};

export const toggleBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        const brand = await toggleBrandService(id);
        res.status(200).json({
            message: "Brand toggled successfully",
            data: brand,
            status: "success",
        });
    } catch (error) {
        next(error);
    }
};
