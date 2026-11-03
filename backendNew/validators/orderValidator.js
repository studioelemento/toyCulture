import Joi from "joi";
import { validator } from "./validator.js";

const placeOrderSchema = Joi.object({
    shipping_address_id: Joi.string().optional().allow(null, ""),
    shipping_address:    Joi.object().optional(),
    coupon_code:         Joi.string().optional().allow(null, ""),
    payment_method:      Joi.string().valid("COD", "RAZORPAY", "WALLET", "UPI", "CARD").default("COD"),
    order_items: Joi.array()
        .items(
            Joi.object({
                product_id: Joi.string().optional(),
                variant_id: Joi.string().optional(),
                id:         Joi.string().optional(),
                quantity:   Joi.number().min(1).default(1),
                price:      Joi.number().optional(),
            }).or("product_id", "variant_id", "id")
        )
        .min(1)
        .required()
        .messages({ "array.min": "Order must have at least 1 item" }),
});

const orderSearchSchema = Joi.object({
    q:      Joi.string().trim().min(0).max(200).allow(""),
    sort:   Joi.string().valid("createdAt").empty("").default("createdAt"),
    order:  Joi.string().valid("asc", "desc").empty("").insensitive().default("desc").optional(),
    status: Joi.string().valid(
        "PLACED",
        "CONFIRMED",
        "PACKED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURNED",
        "REFUNDED",
        "ALL",
        "all"
    ).insensitive().default("ALL"),
    page: Joi.number().integer().custom((value) => {
        if (value < 1) return 1;
        return value;
    }).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
});

const orderStatusSchema = Joi.object({
    status: Joi.string()
        .valid(
            "PLACED",
            "CONFIRMED",
            "PACKED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
            "RETURNED",
            "REFUNDED",
            "CANCELLATION_REQUESTED",
            "CANCELLATION_DENIED",
            "RETURN_REQUESTED",
            "RETURN_DENIED"
        )
        .required(),
    description: Joi.string().default("none"),
});

export const orderStatusValidator = validator(orderStatusSchema);
export const orderSearchValidator = validator(orderSearchSchema);
export const placeOrderValidator  = validator(placeOrderSchema);
