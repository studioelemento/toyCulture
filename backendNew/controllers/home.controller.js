import { prisma } from "../config/prisma.js";
import { getHomeDataService, getProductDataService, getSearchDataService } from "../services/home.service.js";
import { verifyToken } from "../utils/jwt.js";
import { searchValidator } from "../validators/searchValidator.js";

export const getHomeData = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt || req.headers.authorization?.replace(/^Bearer\s+/i, "");
        let user = null;

        if (token) {
            try {
                const data = verifyToken(token);
                if (data?.email) {
                    user = await prisma.user.findUnique({ where: { email: data.email } });
                }
            } catch {}
        }

        const products = await getHomeDataService(user);

        return res.status(200).json({
            message: "Data received",
            status:  "success",
            data:    products[0],
        });
    } catch (error) {
        next(error);
    }
};

export const getSearchData = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt || req.headers.authorization?.replace(/^Bearer\s+/i, "");
        let user = null;

        if (token) {
            try {
                const data = verifyToken(token);
                if (data?.email) {
                    user = await prisma.user.findUnique({ where: { email: data.email } });
                }
            } catch {}
        }

        const { value, error } = searchValidator(req.query);
        const queryParams = error ? req.query : value;

        const products = await getSearchDataService(queryParams, user);
        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const getProductData = async (req, res, next) => {
    try {
        const { id: productId } = req.params;
        const product = await getProductDataService(productId);
        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};
