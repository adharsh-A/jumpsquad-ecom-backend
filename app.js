import express from "express";
import fs from "fs";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import HttpError from "./models/http-error.js";
import bodyParser from "body-parser";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { rateLimiter } from "./middleware/rate-limiter.js";
import helmet from "helmet";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.json({ limit: "10mb" })); // For parsing JSON data
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data
app.disable('x-powered-by');

// CORS configuration
const corsOptions = {
  origin: ["https://jumpsquad.vercel.app", "http://localhost:5173"], // Allows this specific origin
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};
//rate limiter
app.use(rateLimiter);
// Handle preflight requests for all routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // This enables the server to respond to the preflight requests with appropriate CORS headers

//prevent xss attacksand clickjacking
app.use(helmet());


// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static file serving
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);

// Use the routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", (req, res) => {
  res.send("Test endpoint is working");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
/* Uncomment and define these routes if needed
app.use('/api/payments', paymentRoutes);
*/

// 404 Error handling
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  return next(error);
});

// Global error handling
app.use((error, req, res, next) => {
  console.error(error);
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
