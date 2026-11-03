import { prisma } from "../../config/prisma.js";
import { getAllProductsStockService } from "../../services/admin/stock-management.service.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

export const getAllProductsStockController = async (req, res, next) => {
    try {
        const query = req.query;
        const stockRes = await getAllProductsStockService(query);

        return res.status(200).json({
            data:    stockRes,
            message: "Products with stock retrieved successfully",
            status:  "success",
        });
    } catch (error) {
        next(error);
    }
};

export const restokeProductController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const qtyNum = Number(quantity);

        if (!qtyNum || qtyNum < 1) {
            throw new ErrorWithStatus("Quantity should be at least 1", HTTP_RES.BAD_REQUEST);
        }

        // Try restocking a ProductVariant first
        const variant = await prisma.productVariant.findUnique({ where: { id } });
        if (variant) {
            const updated = await prisma.productVariant.update({
                where: { id },
                data:  { stock: variant.stock + qtyNum },
            });
            return res.status(200).json({
                message: "Variant restocked successfully",
                data:    updated,
                status:  "success",
            });
        }

        // Otherwise check Product directly
        const product = await prisma.product.findUnique({ where: { id } });
        if (product) {
            const updated = await prisma.product.update({
                where: { id },
                data:  { stockQTY: (product.stockQTY || 0) + qtyNum },
            });
            return res.status(200).json({
                message: "Product restocked successfully",
                data:    updated,
                status:  "success",
            });
        }

        throw new ErrorWithStatus("Product or Variant not found", HTTP_RES.NOT_FOUND);
    } catch (error) {
        next(error);
    }
};
