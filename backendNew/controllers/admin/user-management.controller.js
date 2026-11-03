import { prisma } from "../../config/prisma.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";
import { getAllUsersService } from "../../services/admin/user-management.service.js";
import { logger } from "../../utils/logger.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL USERS  — GET /api/admin/users
// ─────────────────────────────────────────────────────────────────────────────
export const getAllUsers = async (req, res, next) => {
    try {
        const result = await getAllUsersService(req.query);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        logger.error("Admin getAllUsers failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET USER BY ID  — GET /api/admin/users/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getUsersById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id:         true,
                first_name: true,
                last_name:  true,
                email:      true,
                phone:      true,
                role:       true,
                active:     true,
                gender:     true,
                avatar_url: true,
                is_verified: true,
                referral_id: true,
                last_login: true,
                createdAt:  true,
                updatedAt:  true,
            },
        });

        if (!user) {
            throw new ErrorWithStatus("User not found", HTTP_RES.NOT_FOUND);
        }

        const totalOrders = await prisma.order.count({
            where: { user_id: user.id, deletedAt: null },
        });

        return res.status(200).json({
            success: true,
            message: "User details retrieved successfully",
            data:    { ...user, totalOrders },
        });
    } catch (error) {
        logger.error("Admin getUserById failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE USER STATUS  — PATCH /api/admin/users/:id/toggle
// ─────────────────────────────────────────────────────────────────────────────
export const toggleUserState = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, active: true },
        });

        if (!user) {
            throw new ErrorWithStatus("User not found", HTTP_RES.NOT_FOUND);
        }

        await prisma.user.update({
            where: { id },
            data:  { active: !user.active },
        });

        return res.status(200).json({
            success: true,
            message: `User ${user.active ? "blocked" : "activated"} successfully`,
        });
    } catch (error) {
        logger.error("Admin toggleUserState failed:", error.message);
        next(error);
    }
};