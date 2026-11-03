import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import {
    getAllOrdersService,
    getOrderService,
    updateOrderStatusService,
} from "../../services/admin/order-management.service.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";
import { orderStatusValidator } from "../../validators/orderValidator.js";
import { logger } from "../../utils/logger.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL ORDERS  — GET /api/admin/orders
// ─────────────────────────────────────────────────────────────────────────────
export const getAllOrdersController = async (req, res, next) => {
    try {
        const result = await getAllOrdersService(req.query);
        return res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            ...result,
        });
    } catch (error) {
        logger.error("Admin getAllOrders failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET SINGLE ORDER  — GET /api/admin/orders/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getOrderController = async (req, res, next) => {
    try {
        const order = await getOrderService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Order retrieved successfully",
            data:    order,
        });
    } catch (error) {
        logger.error("Admin getOrder failed:", error.message);
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE ORDER STATUS  — PATCH /api/admin/orders/:id/status
// ─────────────────────────────────────────────────────────────────────────────
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id: orderId }  = req.params;
        const { value, error } = orderStatusValidator(req.body);

        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }

        const { status: newStatus, description } = value;
        const updated = await updateOrderStatusService(orderId, newStatus, description);

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data:    updated,
        });
    } catch (error) {
        logger.error("Admin updateOrderStatus failed:", error.message);
        next(error);
    }
};
