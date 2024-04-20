import ProductModel from "../models/ProductModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
export const getAllProducts = async (req, res, next) => {
  try {
    const product = await ProductModel.find({});
    res.status(200).send({
      success: true,
      message: "Products found succesfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getAllProduct API",
      error,
    });
  }
};

export const getSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return console.log("please provide Product ID");
    const product = await ProductModel.findById(id);

    if (!product)
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    res.status(200).send({
      success: true,
      message: "successfully get single product",
      product,
    });
  } catch (error) {
    console.log(error);
    // Handling caste Error
    if (error.name === "CastError")
      return res.status(500).send({
        success: false,
        message: "Invalid ID",
      });
    res.status(500).send({
      success: false,
      message: "Error in get SingleProduct API",
      error,
    });
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock)
      return res.status(500).send({
        success: false,
        message: "please provide all fields",
      });

    if (!req.file)
      return res.status(500).send({
        success: false,
        message: "please upload image",
      });

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);

    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    const product = await ProductModel.create({
      name,
      description,
      price,
      stock,
      category,
      images: [image],
    });

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Product API",
    });
  }
};
