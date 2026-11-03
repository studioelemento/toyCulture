import "./utils/env.js";
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB, disconnectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";
import ErrorWithStatus from "./config/ErrorWithStatus.js";
import { HTTP_RES } from "./utils/CONSTANTS.js";

// ── Process guards (must be after logger import) ──────────────────────────────
process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception:", err);
});

// ── Route imports ───────────────────────────────────────────────────────────
import authRouter               from "./routes/auth.routes.js";
import productV1Router          from "./routes/product.routes.js";

// Admin routes
import dashboardRouter          from "./routes/admin/adminDashboard.routes.js";
import adminUserManagementRouter from "./routes/admin/user-management.routes.js";
import brandManagementRouter    from "./routes/admin/brand-management.routes.js";
import categoryManagementRouter from "./routes/admin/category-management.routes.js";
import productManagementRouter  from "./routes/admin/product-management.routes.js";
import orderManagementRouter    from "./routes/admin/order-management.routes.js";
import stockManagementRouter    from "./routes/admin/stock-management.routes.js";
import couponManagementRouter   from "./routes/admin/coupon-management.routes.js";
import salesReportRouter        from "./routes/admin/salesReport.routes.js";

// User / customer routes
import homeRouter     from "./routes/home.routes.js";
import accountRouter  from "./routes/account.routes.js";
import cartRouter     from "./routes/cart.routes.js";
import checkoutRouter from "./routes/user/checkout.routes.js";
import orderRouter    from "./routes/user/order.routes.js";
import walletRouter   from "./routes/user/wallet.routes.js";
import wishlistRouter from "./routes/user/wishlist.routes.js";

// ── App setup ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const app  = express();

app.use(morgan("dev"));
app.use(
    cors({
        origin:      ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok", db: "postgresql", timestamp: new Date().toISOString() });
});

// ── Public API routes ────────────────────────────────────────────────────────
app.use("/api/v1/products",  productV1Router);
app.use("/api/auth",         authRouter);
app.use("/api/home",         homeRouter);
app.use("/api/account",      accountRouter);
app.use("/api/cart",         cartRouter);
app.use("/api/checkout",     checkoutRouter);
app.use("/api/order",        orderRouter);
app.use("/api/wallet",       walletRouter);
app.use("/api/wishlist",     wishlistRouter);

// ── Admin API routes ─────────────────────────────────────────────────────────
app.use("/api/admin/dashboard",        dashboardRouter);
app.use("/api/admin/users",            adminUserManagementRouter);
app.use("/api/admin/brands",           brandManagementRouter);
app.use("/api/admin/categories",       categoryManagementRouter);
app.use("/api/admin/products",         productManagementRouter);
app.use("/api/admin/orders",           orderManagementRouter);
app.use("/api/admin/stock",            stockManagementRouter);
app.use("/api/admin/coupons",          couponManagementRouter);
app.use("/api/admin/reports",          salesReportRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, _res, next) => {
    next(new ErrorWithStatus(`Route not found: ${req.method} ${req.path}`, HTTP_RES.NOT_FOUND));
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((error, _req, res, _next) => {
    const statusCode = error?.status || (res.statusCode !== 200 ? res.statusCode : 500);
    logger.error(`[${statusCode}] ${error.message}`);

    res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
});

// ── Server startup ────────────────────────────────────────────────────────────
const start = async () => {
    await connectDB();
    const server = app.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`);
    });

    const shutdown = async () => {
        logger.info("Shutting down gracefully...");
        server.close(async () => {
            await disconnectDB();
            process.exit(0);
        });
    };

    process.on("SIGINT",  shutdown);
    process.on("SIGTERM", shutdown);
};

start();
