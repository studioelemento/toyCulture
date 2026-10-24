import Joi from 'joi'
import { validator } from './validator.js'
const categorySchema = Joi.object({
    name : Joi.string().min(2).max(50).required(),
    parent_id : Joi.string().uuid().allow(null, '').optional(),
    seo_description : Joi.string().max(300).allow('', null).optional(),
})


export const categoryValidator = validator(categorySchema)