import express from "express";
import fs from "fs";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import wishlistRoutes from "./routes/wishlistRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const corsOptions = {
  origin: '*', // This allows requests from any origin
  methods: "GET, POST, PATCH, DELETE, PUT",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
};
/* app.use(cors(corsOptions));
 */app.options('*', cors(corsOptions)); // Preflight response for all routes

/* app.use(express.json);
*/ const DATABASE_URL = process.env.DATABASE_URL;



app.use(bodyParser.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
/* app.use('/api/orders', orderRoutes); 
app.use('/api/payments', paymentRoutes);
app.use('/api/wishlist', wishlistRoutes); */
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
export default app;
