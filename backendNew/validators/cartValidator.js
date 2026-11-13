import Joi from "joi";
import { validator } from "./validator.js";

const cartSchema = Joi.object({
  variant_id: Joi.string().uuid().optional().messages({
    "string.guid": "Variant ID must be a valid UUID",
  }),
  product_id: Joi.string().uuid().optional().messages({
    "string.guid": "Product ID must be a valid UUID",
  }),
  quantity: Joi.number().integer().max(5).invalid(0).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "any.invalid": "Quantity should not be zero",
    "any.required": "Quantity is required",
  }),
})
  .or("variant_id", "product_id")
  .messages({
    "object.missing": "Either product_id or variant_id is required",
  });

const removeCartSchema = Joi.object({
  cart_id: Joi.string().uuid().required().messages({
    "string.empty": "Cart ID is required",
    "string.guid": "Cart ID must be a valid UUID",
    "any.required": "Cart ID is required",
  }),
});

export const removeCartValidator = validator(removeCartSchema);
export const cartValidator = validator(cartSchema);
