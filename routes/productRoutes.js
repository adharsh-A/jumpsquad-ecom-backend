// routes\productRoutes.js
import express from 'express';
const router = express.Router();
import {getAllProducts,getProductsById,addProduct} from "../controllers/product-controllers.js";
import fileUpload from "../middleware/fileupload.js";
import { uploadFileToS3 } from '../middleware/s3upload.js';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth.js';

router.get(
  '/all',
  getAllProducts
);
router.get('/product/:id', getProductsById);
router.post("/admin/add",uploadFileToS3,addProduct); 
// router.post("/admin/add",fileUpload.single('image'),addProduct);

export default router;