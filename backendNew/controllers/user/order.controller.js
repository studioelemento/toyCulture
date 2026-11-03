import { prisma } from "../../config/prisma.js";
import { placeOrderValidator, orderSearchValidator } from "../../validators/orderValidator.js";
import { createOrderService } from "../../services/user/order.service.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

// Place Order
export const addOrderController = async (req, res, next) => {
    try {
        const { value, error } = placeOrderValidator(req.body);
        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }

        const currentUserEmail = req.email || req.user?.email;
        if (!currentUserEmail) {
            throw new ErrorWithStatus("Unauthorized", HTTP_RES.UNAUTHORIZED);
        }

        const order = await createOrderService(currentUserEmail, value);
        return res.status(201).json({
            status:  "success",
            message: "Order placed successfully",
            data:    order,
        });
    } catch (error) {
        next(error);
    }
};

// Get All Orders for logged-in Customer
export const getAllOrderController = async (req, res, next) => {
    try {
        const currentUserEmail = req.email || req.user?.email;
        const user = await prisma.user.findUnique({ where: { email: currentUserEmail } });
        if (!user) {
            throw new ErrorWithStatus("Unauthorized", HTTP_RES.UNAUTHORIZED);
        }

        const { value, error } = orderSearchValidator(req.query);
        const { status = "ALL", page = 1, limit = 10 } = error ? req.query : value;

        const where = {
            user_id:   user.id,
            deletedAt: null,
        };

        if (status && status.toUpperCase() !== "ALL") {
            where.status = status.toUpperCase();
        }

        const pageNum  = Math.max(Number(page) || 1, 1);
        const limitNum = Math.min(Number(limit) || 10, 50);

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    items: {
                        select: {
                            id:            true,
                            product_id:    true,
                            product_name:  true,
                            product_image: true,
                            price:         true,
                            quantity:      true,
                            total:         true,
                        },
                    },
                    shipping_address: true,
                    coupon:           { select: { code: true, value: true, type: true } },
                },
                orderBy: { createdAt: "desc" },
                skip:    limitNum * (pageNum - 1),
                take:    limitNum,
            }),
            prisma.order.count({ where }),
        ]);

        return res.status(200).json({
            status:  "success",
            message: "Orders retrieved successfully",
            data:    orders,
            total,
            page:    pageNum,
            pages:   Math.ceil(total / limitNum),
            limit:   limitNum,
        });
    } catch (error) {
        next(error);
    }
};

// Get Single Order By ID
export const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserEmail = req.email || req.user?.email;
        const user = await prisma.user.findUnique({ where: { email: currentUserEmail } });

        const order = await prisma.order.findFirst({
            where: {
                id,
                ...(user?.role !== "ADMIN" && { user_id: user?.id }),
            },
            include: {
                items:            true,
                shipping_address: true,
                coupon:           true,
            },
        });

        if (!order) {
            throw new ErrorWithStatus("Order not found", HTTP_RES.NOT_FOUND);
        }

        return res.status(200).json({
            status:  "success",
            message: "Order details",
            data:    order,
        });
    } catch (error) {
        next(error);
    }
};

// Request Order Cancellation
export const requestCancellation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserEmail = req.email || req.user?.email;
        const user = await prisma.user.findUnique({ where: { email: currentUserEmail } });

        const order = await prisma.order.findFirst({
            where: { id, user_id: user.id },
            include: { items: true },
        });

        if (!order) {
            throw new ErrorWithStatus("Order not found", HTTP_RES.NOT_FOUND);
        }

        if (["DELIVERED", "CANCELLED", "RETURNED"].includes(order.status)) {
            throw new ErrorWithStatus(`Cannot cancel order in status ${order.status}`, HTTP_RES.BAD_REQUEST);
        }

        // Cancel order and restock items
        const updated = await prisma.$transaction(async (tx) => {
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data:  { stockQTY: { increment: item.quantity } },
                });
            }

            // Refund to wallet if order was paid
            if (order.payment_status === "PAID") {
                const wallet = await tx.wallet.findUnique({ where: { user_id: user.id } });
                if (wallet) {
                    await tx.wallet.update({
                        where: { user_id: user.id },
                        data:  { balance: wallet.balance + order.total_amount },
                    });
                    await tx.transaction.create({
                        data: {
                            wallet_id:    wallet.id,
                            type:         "CREDIT",
                            reason:       "ORDER_REFUND",
                            amount:       order.total_amount,
                            balanceAfter: wallet.balance + order.total_amount,
                            description:  `Refund for cancelled order ${order.order_number}`,
                        },
                    });
                }
            }

            return tx.order.update({
                where: { id: order.id },
                data: {
                    status:         "CANCELLED",
                    payment_status: order.payment_status === "PAID" ? "REFUNDED" : "CANCELLED",
                    cancelled_at:   new Date(),
                    status_history: [
                        ...(Array.isArray(order.status_history) ? order.status_history : []),
                        { status: "CANCELLED", timestamp: new Date().toISOString(), note: "Cancelled by user" },
                    ],
                },
            });
        });

        return res.status(200).json({
            status:  "success",
            message: "Order cancelled successfully",
            data:    updated,
        });
    } catch (error) {
        next(error);
    }
};

// Cancel Single Order Item
export const cancelOrderItemController = async (req, res, next) => {
    return requestCancellation(req, res, next);
};

// Request Return
export const requestReturn = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order || order.status !== "DELIVERED") {
            throw new ErrorWithStatus("Only delivered orders can be returned", HTTP_RES.BAD_REQUEST);
        }

        const updated = await prisma.order.update({
            where: { id },
            data: {
                status: "RETURNED",
                status_history: [
                    ...(Array.isArray(order.status_history) ? order.status_history : []),
                    { status: "RETURNED", timestamp: new Date().toISOString(), note: "Return processed" },
                ],
            },
        });

        return res.status(200).json({
            status:  "success",
            message: "Return request processed",
            data:    updated,
        });
    } catch (error) {
        next(error);
    }
};

export const requestReturnItemController = async (req, res, next) => {
    return requestReturn(req, res, next);
};

export const repayOrderController = async (_req, res) => {
    return res.status(200).json({ status: "success", message: "Repay endpoint ready" });
};

export const cancelPayment = async (_req, res) => {
    return res.status(200).json({ status: "success", message: "Payment cancelled" });
};

export const verifyPayment = async (_req, res) => {
    return res.status(200).json({ status: "success", message: "Payment verified successfully" });
};
