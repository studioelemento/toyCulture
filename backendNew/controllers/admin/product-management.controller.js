import { Product } from "../../models/product.model.js";
import { productValidator } from "../../validators/productValidator.js";
import { generateSKU } from "../../utils/generateSKU.js";
import { ProductVariant } from "../../models/product_variants.model.js";
import mongoose from "mongoose";
import { uploadImages } from "../../utils/cloudinary.js";
import {
    editProductService,
    getAllProductService,
    getProductService,
    createProductService,
} from "../../services/admin/product-management.service.js";

export const addProduct = async (req, res, next) => {
  // Parse incoming data and validate
  const parsedData = { ...req.body, variants: JSON.parse(req.body.variants) };
  const { value, error } = productValidator(parsedData);
  if (req.files.length < 4) {
    res.status(400);
    throw new Error("4 images required");
  }
  if (error) {
    res.status(400);
    throw error;
  }

  try {
    // Delegate creation to Prisma‑based service
    const createdProduct = await createProductService(value, req);
    res.status(201).json({
      message: "Product Created Successfully",
      data: createdProduct,
      status: "success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getAllProducts = async (req, res, next) => {
    try {
        const query = req.query;
        console.log(query);
        const productRes = await getAllProductService(query);
        res.status(200).json(productRes);
    } catch (error) {
        next(error);
    }
};

export const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await getProductService(id);
        console.log(product);
        res.status(200).json({
            message: "product found successfully",
            data: product,
            status: "success",
        });
    } catch (error) {
        next(error);
    }
};

export const editProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(req.body)
        const {value , error} = productValidator({ ...req.body, variants: JSON.parse(req.body.variants) });
        if(error){
            throw error
        }
        console.log(value , 223)
        // if (value.images.length + data.imagesData.filter(x => )) {
        //     res.status(400);
        //     throw new Error("4 images required");
        // }

        // console.log(req.body,id, 3434);
        // Todo MIGHT ADD VALIDATOR
        // console.log(req.body);
        const product = await editProductService(id, value, req);
        res.status(200).json({
            message: "product edited successfully",
            datat: product,
            status: "success",
        });
    } catch (error) {
        console.log(1235334, error);
        next(error);
    }
};

export const toggleProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            res.status(404);
            throw new Error("No product with Id found");
        }
        product.is_active = !product.is_active;

        await product.save();
        console.log(product, 9990);
        res.status(200).json({
            message: "Product toggled successfulyy",
            status: "success",
        });
    } catch (error) {
        next(error);
    }
};