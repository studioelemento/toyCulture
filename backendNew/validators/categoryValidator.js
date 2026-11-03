import Joi from 'joi';
import { validator } from './validator.js';

const attributeItemSchema = Joi.object({
    id: Joi.string().allow('', null).optional(),
    name: Joi.string().trim().min(1).max(100).required(),
    placeholder: Joi.string().trim().allow('', null).optional(),
    hint: Joi.string().trim().allow('', null).optional(),
});

const categorySchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    parent_id: Joi.string().uuid().allow(null, '').optional(),
    seo_description: Joi.string().max(300).allow('', null).optional(),
    attributes: Joi.array().items(attributeItemSchema).default([]).optional(),
});

export const categoryValidator = validator(categorySchema);
