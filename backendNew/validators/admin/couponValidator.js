import Joi from "joi";
import { validator } from "../validator.js";

const codeSchema = Joi.string()
  .uppercase()
  .pattern(/^[A-Z0-9-]+$/)
  .min(7)
  .max(9)
  .messages({
    "string.pattern.base": "Code may only contain A–Z, 0–9, and hyphens",
    "string.min": "Coupon code must be at least 7 characters",
    "string.max": "Coupon code must be at most 9 characters",
  });

const couponFields = {
  code: codeSchema.required(),
  description: Joi.string().max(150).allow("", null).optional(),
  type: Joi.string().valid("PERCENTAGE", "FIXED").required(),
  value: Joi.number().positive().precision(2).required(),
  min_order_amount: Joi.number().min(0).default(0),
  max_discount: Joi.number().min(0).allow(null).optional(),
  usage_limit: Joi.number().integer().min(1).allow(null).optional(),
  per_user_limit: Joi.number().integer().min(1).default(1),
  valid_until: Joi.date().required().messages({
    "date.base": "Valid until must be a valid date",
    "any.required": "Valid until is required",
  }),
  is_active: Joi.boolean().optional(),
};

const createCouponSchema = Joi.object({
  ...couponFields,
  valid_until: couponFields.valid_until.greater("now").messages({
    "date.greater": "Valid until must be in the future",
  }),
  value: Joi.when("type", {
    is: "PERCENTAGE",
    then: Joi.number().min(1).max(100).precision(2).required(),
    otherwise: Joi.number().positive().precision(2).required(),
  }),
});

const editCouponSchema = Joi.object({
  ...couponFields,
  code: codeSchema.optional(),
  type: Joi.string().valid("PERCENTAGE", "FIXED").optional(),
  value: Joi.number().positive().precision(2).optional(),
  valid_until: Joi.date().optional(),
}).min(1);

export const couponValidator = validator(createCouponSchema);
export const editCouponValidator = validator(editCouponSchema);
