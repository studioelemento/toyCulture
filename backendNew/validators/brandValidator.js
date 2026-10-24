
import Joi from 'joi'
import { validator } from './validator.js'
const brandSchema = Joi.object({
    name : Joi.string().min(2).max(50).required(),
    seo_title : Joi.string().max(100).allow('', null).optional(),
    seo_description : Joi.string().max(300).allow('', null).optional(),
})


export const brandValidator = validator(brandSchema)
