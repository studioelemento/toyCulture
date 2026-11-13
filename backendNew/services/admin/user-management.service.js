import { prisma } from "../../config/prisma.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

const USER_SORT_FIELDS = new Set(["createdAt", "updatedAt", "last_login", "email", "first_name"]);

function displayName(user) {
    return [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || user?.email || "Customer";
}

function buildUserWhere(query) {
    const where = { deletedAt: null };
    const filter = query.filter || "AllUsers";
    const role = String(query.role || "").toUpperCase();

    if (role === "USER" || role === "ADMIN") {
        where.role = role;
    } else if (filter === "Admin") {
        where.role = "ADMIN";
    } else if (filter === "User") {
        where.role = "USER";
    }

    if (filter === "ActiveUsers") where.active = true;
    if (filter === "InActiveUsers") where.active = false;
    if (filter === "Unverified") where.is_verified = false;
    if (filter === "Google") where.is_google_login = true;

    const search = query.search?.trim() || "";
    if (search) {
        where.OR = [
            { first_name: { contains: search, mode: "insensitive" } },
            { last_name:  { contains: search, mode: "insensitive" } },
            { email:      { contains: search, mode: "insensitive" } },
            { phone:      { contains: search, mode: "insensitive" } },
        ];
    }

    return where;
}

export const getAllUsersService = async (query) => {
    const limit  = Math.min(Number(query.limit) || 10, 100);
    const page   = Math.max(Number(query.page)  || 1, 1);
    const filter = query.filter || "AllUsers";
    const sortBy = USER_SORT_FIELDS.has(query.sort) ? query.sort : "createdAt";
    const order  = query.order === "asc" ? "asc" : "desc";
    const where  = buildUserWhere(query);
    const customerWhere = { deletedAt: null, role: "USER" };

    const [data, totalUsers, blockedUsers, customerCounts] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id:              true,
                first_name:      true,
                last_name:       true,
                email:           true,
                phone:           true,
                role:            true,
                active:          true,
                gender:          true,
                avatar_url:      true,
                is_verified:     true,
                is_google_login: true,
                referral_id:     true,
                last_login:      true,
                createdAt:       true,
                updatedAt:       true,
                _count: {
                    select: {
                        orders: { where: { deletedAt: null } },
                    },
                },
            },
            orderBy: { [sortBy]: order },
            skip:    limit * (page - 1),
            take:    limit,
        }),
        prisma.user.count({ where }),
        prisma.user.count({
            where: {
                deletedAt: null,
                active:    false,
                ...(where.role ? { role: where.role } : {}),
            },
        }),
        prisma.user.groupBy({
            by:     ["active", "is_verified", "is_google_login"],
            where:  customerWhere,
            _count: { _all: true },
        }),
    ]);

    const counts = {
        total:      0,
        active:     0,
        blocked:    0,
        unverified: 0,
        google:     0,
    };
    for (const row of customerCounts) {
        counts.total += row._count._all;
        if (row.active) counts.active += row._count._all;
        else counts.blocked += row._count._all;
        if (!row.is_verified) counts.unverified += row._count._all;
        if (row.is_google_login) counts.google += row._count._all;
    }

    return {
        data: data.map(({ _count, ...user }) => ({
            ...user,
            name:         displayName(user),
            orders_count: _count?.orders ?? 0,
        })),
        total_users:   totalUsers,
        blocked_users: blockedUsers,
        counts,
        filter,
        pages:         Math.ceil(totalUsers / limit) || 1,
        page,
        limit,
    };
};

export const getUserByIdService = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id:              true,
            first_name:      true,
            last_name:       true,
            email:           true,
            phone:           true,
            role:            true,
            active:          true,
            gender:          true,
            avatar_url:      true,
            is_verified:     true,
            is_google_login: true,
            referral_id:     true,
            last_login:      true,
            createdAt:       true,
            updatedAt:       true,
            wallet:          { select: { balance: true } },
            addresses: {
                where:   { deletedAt: null },
                orderBy: [{ is_primary: "desc" }, { createdAt: "desc" }],
                take:    8,
                select: {
                    id:           true,
                    is_primary:   true,
                    first_name:   true,
                    last_name:    true,
                    phone:        true,
                    address:      true,
                    place:        true,
                    pincode:      true,
                    state:        true,
                    address_type: true,
                    landmark:     true,
                },
            },
            orders: {
                where:   { deletedAt: null },
                orderBy: { createdAt: "desc" },
                take:    8,
                select: {
                    id:             true,
                    order_number:   true,
                    status:         true,
                    payment_status: true,
                    total_amount:   true,
                    createdAt:      true,
                },
            },
            reviews: {
                where:   { deletedAt: null },
                orderBy: { createdAt: "desc" },
                take:    5,
                select: {
                    id:          true,
                    rating:      true,
                    comment:     true,
                    is_approved: true,
                    createdAt:   true,
                    product:     { select: { name: true } },
                },
            },
            _count: {
                select: {
                    orders:    { where: { deletedAt: null } },
                    reviews:   { where: { deletedAt: null } },
                    addresses: { where: { deletedAt: null } },
                },
            },
        },
    });

    if (!user) {
        throw new ErrorWithStatus("User not found", HTTP_RES.NOT_FOUND);
    }

    const activity = [
        { type: "registered", label: "Account created", at: user.createdAt },
        user.is_verified ? { type: "verified", label: "Email verified", at: user.createdAt } : null,
        user.last_login ? { type: "login", label: "Last login", at: user.last_login } : null,
        ...user.orders.map((order) => ({
            type:  "order",
            label: `Order ${order.order_number} · ${order.status}`,
            at:    order.createdAt,
            meta:  { order_id: order.id, amount: order.total_amount },
        })),
        ...user.reviews.map((review) => ({
            type:  "review",
            label: `Reviewed ${review.product?.name || "a product"} (${review.rating}/5)`,
            at:    review.createdAt,
        })),
    ]
        .filter(Boolean)
        .sort((a, b) => new Date(b.at) - new Date(a.at));

    return {
        ...user,
        name:         displayName(user),
        totalOrders:  user._count.orders,
        wallet_balance: user.wallet?.balance ?? 0,
        activity,
    };
};

export const toggleUserStateService = async (id) => {
    const user = await prisma.user.findUnique({
        where:  { id },
        select: { id: true, active: true, role: true },
    });

    if (!user) {
        throw new ErrorWithStatus("User not found", HTTP_RES.NOT_FOUND);
    }
    if (user.role === "ADMIN") {
        throw new ErrorWithStatus("Admin accounts cannot be blocked from this screen", HTTP_RES.BAD_REQUEST);
    }

    const updated = await prisma.user.update({
        where: { id },
        data:  { active: !user.active },
        select: { id: true, active: true },
    });

    return {
        ...updated,
        message: `User ${user.active ? "blocked" : "activated"} successfully`,
    };
};
