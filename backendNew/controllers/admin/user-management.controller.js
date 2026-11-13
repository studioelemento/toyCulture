import {
    getAllUsersService,
    getUserByIdService,
    toggleUserStateService,
} from "../../services/admin/user-management.service.js";
import { logger } from "../../utils/logger.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const result = await getAllUsersService(req.query);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        logger.error("Admin getAllUsers failed:", error.message);
        next(error);
    }
};

export const getUsersById = async (req, res, next) => {
    try {
        const data = await getUserByIdService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "User details retrieved successfully",
            data,
        });
    } catch (error) {
        logger.error("Admin getUserById failed:", error.message);
        next(error);
    }
};

export const toggleUserState = async (req, res, next) => {
    try {
        const result = await toggleUserStateService(req.params.id);
        return res.status(200).json({
            success: true,
            message: result.message,
            data:    { id: result.id, active: result.active },
        });
    } catch (error) {
        logger.error("Admin toggleUserState failed:", error.message);
        next(error);
    }
};
