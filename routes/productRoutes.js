// routes\productRoutes.js
import express from "express";
import {
  getAllProducts,
  addProduct,
  testProduct,
} from "../controllers/product-controllers.js";
import { uploadFileToS3 } from "../middleware/s3upload.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/all", getAllProducts);
router.post(
  "/admin/add",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  uploadFileToS3,
  addProduct
);

export default router;
