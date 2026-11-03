import { prisma } from "../../config/prisma.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES, STATUS_TRANSITIONS } from "../../utils/CONSTANTS.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL ORDERS  (admin — paginated, searchable, filterable by status)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllOrdersService = async (query) => {
    const limit  = Math.min(Number(query.limit) || 10, 100);
    const page   = Math.max(Number(query.page)  || 1, 1);
    const search = query.search?.trim() || "";
    const status = query.status?.toUpperCase() || "ALL";
    const sortBy = query.sort  || "createdAt";
    const order  = query.order === "asc" ? "asc" : "desc";

    const where = { deletedAt: null };

    if (status !== "ALL") {
        where.status = status;
    }

    if (search) {
        where.OR = [
            { order_number: { contains: search, mode: "insensitive" } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { user: { first_name: { contains: search, mode: "insensitive" } } },
        ];
    }

    const [data, total, deliveredCount] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                        phone: true,
                    },
                },
                items: {
                    select: {
                        id: true,
                        product_name: true,
                        product_image: true,
                        price: true,
                        quantity: true,
                        total: true,
                    },
                },
                shipping_address: true,
                coupon: { select: { id: true, code: true, type: true, value: true } },
            },
            orderBy: { [sortBy]: order },
            skip:    limit * (page - 1),
            take:    limit,
        }),
        prisma.order.count({ where }),
        prisma.order.count({ where: { deletedAt: null, status: "DELIVERED" } }),
    ]);

    // Shape data to match what the frontend expects
    const shaped = data.map((o) => ({
        ...o,
        id:            o.id,
        customer:      `${o.user?.first_name ?? ""} ${o.user?.last_name ?? ""}`.trim() || "Unknown",
        email:         o.user?.email ?? "",
        itemsCount:    o.items?.length ?? 0,
        totalAmount:   o.total_amount,
        paymentMethod: o.payment_method,
        paymentStatus: o.payment_status,
        status:        o.status,
        createdAt:     o.createdAt,
    }));

    return {
        data: shaped,
        page,
        pages: Math.ceil(total / limit),
        limit,
        total_orders:     total,
        delivered_orders: deliveredCount,
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET SINGLE ORDER  (admin — full detail)
// ─────────────────────────────────────────────────────────────────────────────
export const getOrderService = async (id) => {
    const order = await prisma.order.findUnique({
        where: { id, deletedAt: null },
        include: {
            user: {
                select: { id: true, first_name: true, last_name: true, email: true, phone: true },
            },
            items: {
                include: {
                    product: {
                        select: { id: true, name: true, images: true },
                    },
                    variant: true,
                },
            },
            shipping_address: true,
            coupon:           true,
            transaction:      true,
        },
    });

    if (!order) {
        throw new ErrorWithStatus("Order not found", HTTP_RES.NOT_FOUND);
    }

    return order;
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE ORDER STATUS  (admin — with transition validation)
// ─────────────────────────────────────────────────────────────────────────────
export const updateOrderStatusService = async (orderId, newStatus, description) => {
    // Statuses that only the user can set
    if (["RETURN_REQUESTED"].includes(newStatus)) {
        throw new ErrorWithStatus("Cannot manually set this status", HTTP_RES.BAD_REQUEST);
    }

    const existingOrder = await prisma.order.findUnique({
        where: { id: orderId, deletedAt: null },
        include: { items: true, transaction: true },
    });
    if (!existingOrder) throw new ErrorWithStatus("Order not found", HTTP_RES.NOT_FOUND);

    const currentStatus    = existingOrder.status;
    const allowedNextSteps = [
        ...(STATUS_TRANSITIONS[currentStatus] ?? []),
        "CANCELLED",
    ];

    if (process.env.NODE_ENV === "production" && !allowedNextSteps.includes(newStatus)) {
        throw new ErrorWithStatus(
            `Cannot transition order from "${currentStatus}" to "${newStatus}"`,
            HTTP_RES.CONFLICT
        );
    }

    if (
        process.env.NODE_ENV === "production" &&
        existingOrder.payment_method === "RAZORPAY" &&
        existingOrder.payment_status !== "PAID"
    ) {
        throw new ErrorWithStatus(
            "Cannot advance order status until payment is confirmed",
            HTTP_RES.BAD_REQUEST
        );
    }

    const existingHistory = Array.isArray(existingOrder.status_history)
        ? existingOrder.status_history
        : [];

    // Build the update payload
    const updateData = {
        status: newStatus,
        status_history: [
            ...existingHistory,
            { status: newStatus, description: description ?? "", timestamp: new Date().toISOString() },
        ],
    };

    // Mark COD as PAID on delivery
    if (newStatus === "DELIVERED" && existingOrder.payment_method === "COD") {
        updateData.payment_status = "PAID";
    }

    // Handle returns — refund to wallet
    if (newStatus === "RETURNED" && existingOrder.payment_status === "PAID") {
        updateData.payment_status = "REFUNDED";
        // Credit wallet
        await prisma.wallet.upsert({
            where:  { user_id: existingOrder.user_id },
            update: { balance: { increment: existingOrder.total_amount } },
            create: { user_id: existingOrder.user_id, balance: existingOrder.total_amount },
        });
        // Log transaction
        const wallet = await prisma.wallet.findUnique({ where: { user_id: existingOrder.user_id } });
        if (wallet) {
            await prisma.transaction.create({
                data: {
                    wallet_id:    wallet.id,
                    type:         "CREDIT",
                    reason:       "ORDER_REFUND",
                    amount:       existingOrder.total_amount,
                    balanceAfter: wallet.balance + existingOrder.total_amount,
                    description:  `Refund for returned order ${existingOrder.order_number}`,
                },
            });
        }
    }

    return prisma.order.update({
        where: { id: orderId },
        data:  updateData,
        include: {
            user:  { select: { id: true, first_name: true, last_name: true, email: true } },
            items: true,
        },
    });
};
