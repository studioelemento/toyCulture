import { AdminDashboardService } from "../../services/admin/adminDashboard.service.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET DASHBOARD DATA  — GET /api/admin/dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const dashboardController = async (req, res, next) => {
    try {
        const chartType = ["monthly", "weekly", "daily"].includes(req.query?.type)
            ? req.query.type
            : "daily";

        const [summary, chartData, topData] = await Promise.all([
            AdminDashboardService.getSummary(),
            AdminDashboardService.getChartData(chartType),
            AdminDashboardService.topThreeData(),
        ]);

        return res.status(HTTP_RES.OK).json({
            success: true,
            message: "Dashboard data retrieved successfully",
            data: { summary, chartData, topData },
        });
    } catch (error) {
        next(error);
    }
};
