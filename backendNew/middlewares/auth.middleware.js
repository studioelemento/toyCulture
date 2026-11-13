import ErrorWithStatus from "../config/ErrorWithStatus.js";
import { prisma } from "../config/prisma.js";
import { HTTP_RES } from "../utils/CONSTANTS.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt || req.headers.authorization?.replace(/^Bearer\s+/i, "");
        const userEmailHeader = req.headers["x-user-email"];

        if (!token) {
            // If caller specified an explicit user email (e.g. from customer session), use it
            if (userEmailHeader) {
                const user = await prisma.user.findUnique({ where: { email: String(userEmailHeader).trim().toLowerCase() } });
                if (user && user.active) {
                    req.user  = user;
                    req.email = user.email;
                    return next();
                }
            }

            if (process.env.ALLOW_DEV_AUTH_BYPASS === "true") {
                let devAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
                if (devAdmin) {
                    req.user = devAdmin;
                    req.email = devAdmin.email;
                    return next();
                }
            }

            throw new ErrorWithStatus("Unauthorized: No token provided", HTTP_RES.UNAUTHORIZED);
        }

        const data = verifyToken(token);
        if (!data?.email) {
            throw new ErrorWithStatus("Unauthorized: Invalid token", HTTP_RES.UNAUTHORIZED);
        }

        const user = await prisma.user.findUnique({ where: { email: data.email } });

        if (!user) {
            throw new ErrorWithStatus("Unauthorized: User not found", HTTP_RES.UNAUTHORIZED);
        }

        if (!user.active) {
            throw new ErrorWithStatus("Access denied: User is blocked", HTTP_RES.FORBIDDEN);
        }

        req.user  = user;
        req.email = data.email;
        next();
    } catch (error) {
        if (req.cookies?.jwt) {
            res.cookie("jwt", "", { maxAge: 0, sameSite: "None", secure: true });
        }
        next(error);
    }
};
