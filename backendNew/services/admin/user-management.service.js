import { prisma } from "../../config/prisma.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL USERS  (admin — paginated, searchable, filterable)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllUsersService = async (query) => {
    const limit  = Math.min(Number(query.limit) || 10, 100);
    const page   = Math.max(Number(query.page)  || 1, 1);
    const search = query.search?.trim() || "";
    const filter = query.filter || "AllUsers";
    const sortBy = query.sort  || "createdAt";
    const order  = query.order === "asc" ? "asc" : "desc";

    // Build where clause
    const where = { deletedAt: null };

    if (filter === "ActiveUsers")  where.active = true;
    if (filter === "InActiveUsers") where.active = false;
    if (filter === "Admin")        where.role = "ADMIN";
    if (filter === "User")         where.role = "USER";

    if (search) {
        where.OR = [
            { first_name: { contains: search, mode: "insensitive" } },
            { last_name:  { contains: search, mode: "insensitive" } },
            { email:      { contains: search, mode: "insensitive" } },
        ];
    }

    const [data, totalUsers, blockedUsers] = await Promise.all([
        prisma.user.findMany({
            where,
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
                is_google_login: true,
                referral_id: true,
                last_login: true,
                createdAt:  true,
                updatedAt:  true,
                // Exclude password
            },
            orderBy: { [sortBy]: order },
            skip:    limit * (page - 1),
            take:    limit,
        }),
        prisma.user.count({ where }),
        prisma.user.count({ where: { deletedAt: null, active: false } }),
    ]);

    return {
        data,
        total_users:   totalUsers,
        blocked_users: blockedUsers,
        pages:         Math.ceil(totalUsers / limit),
        page,
        limit,
    };
};
