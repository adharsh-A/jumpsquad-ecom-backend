import Product from "../models/product.js";
import HttpError from "../models/http-error.js";

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
  console.log('Uploaded file:', req.file); 
  try {
    // Destructure the request body to get product details
    const { title, price, description, category} = req.body;

    // Validate required fields
    if (!title || !price ) {
      return res
        .status(400)
        .json({ message: "All fields except image are required" });
    }

    // Create a new product
    const newProduct = new Product({
      title,
      price,
      description,
      category,
      image: req.file.path,
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
res.status(400).json({
  message: "Product Never Added" 
});
  }
};

export default { getAllProducts, getProductsById, addProduct };
