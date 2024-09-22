import Product from "../models/product.js";
import HttpError from "../models/http-error.js";
import { v1 as uuid } from "uuid";
import multer from "multer";

import NodeCache from "node-cache";
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const getAllProducts = async (req, res, next) => {
  const cachedData = myCache.get("dataKey");
  if (cachedData) {
     return res.json({
      products: cachedData,
    });
  }
  let products;
  try {
    products = await Product.find({});
  } catch (e) {
    return next(e);
  }
  const actualData= products.map((user) => user.toObject({ getters: true }))
  myCache.set("dataKey", actualData);
  console.log("from fetched")
  res.json({
    products: actualData,
  });
};
export const getProductsById = async (req, res, next) => {
  const productId = req.params.id;
  res.send({ message: productId });
};

export const addProduct = async (req, res, next) => {
  console.log(req.body);
  console.log("Uploaded file:", req.file);
  // Destructure the request body to get product details
  const { title, price, description, category } = req.body;
  const { Location, Bucket, Key, ETag } = req.s3Data;
  // const image = req.file; // Handle the uploaded file multer

  // Validate required fields
  if (!title || !price) {
    console.error(title);
    return res
      .status(400)
      .json({ message: "All fields except image are required" });
  }
  try {
    // Create a new product
    const newProduct = new Product({
      title,
      price,
      description,
      category,
      image: Location ? Location : null, // Save the image path if uploaded
    });

    // Save the product to the database
    await newProduct.save();

    // Send a success response
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Product Never Added", 500));
  }
};
export const testProduct = async (req, res, next) => {
  console.log(" testProduct called");
  res.send({ message: "Test endpoint is working" });
};
export const updateProduct = async (req, res, next) => {
  const productId = req.params.id;
  const { title, price, description, category } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(productId, {});

  if (!updatedProduct) {
    return next(new HttpError("Product not found", 404));
  }

  updatedProduct.title = title;
  updatedProduct.price = price;
  updatedProduct.description = description;
  updatedProduct.category = category;
  await updatedProduct.save();

  res
    .status(200)
    .json({ message: "Product updated successfully", product: updatedProduct });
};

export default { getAllProducts, getProductsById, addProduct, testProduct };
