import express from 'express';
import {
    login,signup
} from "../controllers/auth-controllers.js";
import multer from 'multer';

const upload = multer();

const router = express.Router();

router.post(
  '/signup',upload.none(),
  signup
);

router.post('/login',upload.none(), login);

export default router;  