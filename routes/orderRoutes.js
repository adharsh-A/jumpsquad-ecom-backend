import express from "express";
import { createOrder, verifyPayment } from "../controllers/order-controllers.js";


const router = express.Router();

router.post("/create-order", createOrder);
router.get('/paypal/verify-payment/:orderID',verifyPayment);

export default router;