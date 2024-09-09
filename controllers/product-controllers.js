import Product from "../models/product.js";
import HttpError from "../models/http-error.js";
import { v1 as uuid } from "uuid";
import multer from "multer";


export const getAllProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find({})
    
  } catch (e) {
    return next(new HttpError("Fetching users failed, please try again later"
      ,500));
  }
  res.json({ products: products.map(user => user.toObject({ getters: true })) });
};
export const getProductsById = async (req, res, next) => {
  const productId = req.params.id;
  res.send({ message: productId });
};

export const addProduct = async (req, res, next) => {
  console.log(req.body);
  console.log('Uploaded file:', req.file); 
  // Destructure the request body to get product details
  const { title, price, description, category} = req.body;
  const { Location, Bucket, Key, ETag } = req.s3Data;
    // const image = req.file; // Handle the uploaded file multer

  // Validate required fields
  if (!title || !price ) {
    console.error(title);
    return res
      .status(400)
      .json({ message: "All fields except image are required" });
  }
  try {
    const newId = uuid(); 
    // Create a new product
    const newProduct = new Product({
      productId: newId,
      title,
      price,
      description,
      category,
      image: Location ? Location :null, // Save the image path if uploaded
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
}

export default { getAllProducts, getProductsById, addProduct, testProduct };
