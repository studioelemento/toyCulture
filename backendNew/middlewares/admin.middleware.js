import ErrorWithStatus from "../config/ErrorWithStatus.js";
import { HTTP_RES } from "../utils/CONSTANTS.js";

export const checkAdminRole = (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ErrorWithStatus("Unauthorized: User not authenticated", HTTP_RES.UNAUTHORIZED);
        }

        if (!user.active) {
            res.cookie("jwt", "", { maxAge: 0, sameSite: "None", secure: true });
            throw new ErrorWithStatus("Access denied: User is blocked", HTTP_RES.FORBIDDEN);
        }

        // Prisma Role enum is uppercase: "ADMIN"
        if (user.role !== "ADMIN") {
            throw new ErrorWithStatus("Forbidden: Admin access required", HTTP_RES.FORBIDDEN);
        }

        next();
    } catch (error) {
        next(error);
    }
};
