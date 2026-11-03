import { prisma } from "../../config/prisma.js";

export class AdminDashboardService {

    // ─────────────────────────────────────────────────────────────────────────
    // SUMMARY KPIs  (total orders, revenue, products, users)
    // ─────────────────────────────────────────────────────────────────────────
    static async getSummary() {
        const [
            totalOrders,
            deliveredOrders,
            totalProducts,
            activeProducts,
            lowStockProducts,
            totalUsers,
            revenueResult,
        ] = await Promise.all([
            prisma.order.count({ where: { deletedAt: null } }),
            prisma.order.count({ where: { deletedAt: null, status: "DELIVERED" } }),
            prisma.product.count({ where: { deletedAt: null } }),
            prisma.product.count({ where: { deletedAt: null, is_active: true } }),
            prisma.product.count({ where: { deletedAt: null, is_active: true, stockQTY: { lt: 10 } } }),
            prisma.user.count({ where: { deletedAt: null, role: "USER" } }),
            prisma.order.aggregate({
                where: {
                    deletedAt:      null,
                    payment_status: "PAID",
                },
                _sum: { total_amount: true },
            }),
        ]);

        return {
            total_orders:     totalOrders,
            delivered_orders: deliveredOrders,
            total_products:   totalProducts,
            active_products:  activeProducts,
            low_stock_count:  lowStockProducts,
            total_users:      totalUsers,
            total_revenue:    revenueResult._sum.total_amount ?? 0,
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CHART DATA  (revenue grouped by day / week / month)
    // ─────────────────────────────────────────────────────────────────────────
    static async getChartData(type = "daily") {
        // Fetch all paid orders
        const orders = await prisma.order.findMany({
            where: {
                deletedAt:      null,
                payment_status: "PAID",
            },
            select: { createdAt: true, total_amount: true },
            orderBy: { createdAt: "asc" },
        });

        // Group by date bucket in JS (no raw SQL needed)
        const buckets = {};

        for (const { createdAt, total_amount } of orders) {
            let key;
            const d = new Date(createdAt);

            if (type === "monthly") {
                key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            } else if (type === "weekly") {
                // ISO week: Monday start
                const dayOfWeek = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
                const monday    = new Date(d);
                monday.setDate(d.getDate() - dayOfWeek);
                key = monday.toISOString().slice(0, 10);
            } else {
                // daily (default)
                key = d.toISOString().slice(0, 10);
            }

            buckets[key] = (buckets[key] ?? 0) + (total_amount ?? 0);
        }

        return Object.entries(buckets).map(([date, value]) => ({
            date,
            value: Math.round(value * 100) / 100,
        }));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TOP PERFORMERS  (products, categories, brands by order item count)
    // ─────────────────────────────────────────────────────────────────────────
    static async topThreeData() {
        // Group order items by product
        const topProductsRaw = await prisma.orderItem.groupBy({
            by:      ["product_id"],
            _count:  { product_id: true },
            orderBy: { _count: { product_id: "desc" } },
            take:    4,
        });

        const topProducts = await Promise.all(
            topProductsRaw.map(async (row) => {
                const product = await prisma.product.findUnique({
                    where:  { id: row.product_id },
                    select: { id: true, name: true },
                });
                return { _id: row.product_id, count: row._count.product_id, name: product?.name ?? "Unknown" };
            })
        );

        // Group by category via product relation
        const productsWithCat = await prisma.product.findMany({
            where:   { deletedAt: null, category_id: { not: null } },
            select:  { category_id: true, category: { select: { name: true } } },
        });
        const catMap = {};
        for (const p of productsWithCat) {
            if (!p.category_id) continue;
            catMap[p.category_id] = catMap[p.category_id] ?? { count: 0, name: p.category?.name ?? "Unknown" };
            catMap[p.category_id].count++;
        }
        const topCategories = Object.entries(catMap)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 3)
            .map(([id, { count, name }]) => ({ _id: id, count, name }));

        // Group by brand via product relation
        const productsWithBrand = await prisma.product.findMany({
            where:   { deletedAt: null, brand_id: { not: null } },
            select:  { brand_id: true, brand: { select: { name: true } } },
        });
        const brandMap = {};
        for (const p of productsWithBrand) {
            if (!p.brand_id) continue;
            brandMap[p.brand_id] = brandMap[p.brand_id] ?? { count: 0, name: p.brand?.name ?? "Unknown" };
            brandMap[p.brand_id].count++;
        }
        const topBrands = Object.entries(brandMap)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 3)
            .map(([id, { count, name }]) => ({ _id: id, count, name }));

        return { topProducts, topCategories, topBrands };
    }
}
