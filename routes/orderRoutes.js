import express from "express";
import { createOrder, verifyPayment, getOrders, getOrderById } from "../controllers/order-controllers.js";



const router = express.Router();

router.post("/create-order", createOrder);
router.get('/paypal/verify-payment/:orderID',verifyPayment);
router.get("/get-order", getOrders);
router.get("/order", getOrderById);

export default router;