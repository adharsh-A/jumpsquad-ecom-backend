import express from "express";
const router = express.Router();
import { updatePersonalInfo } from "../controllers/user-controllers.js";
import { uploadFileToS3 } from "../middleware/s3upload.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

router.put(
  "/user/update",
  isAuthenticatedUser,
  uploadFileToS3,
  updatePersonalInfo
);

export default router;
