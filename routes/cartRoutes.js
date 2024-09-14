// routes/cart.js
import express from 'express';
import Cart from '../models/cart.js';
import {saveCart,deleteCart,getCart} from '../controllers/cart-controllers.js';
const router = express.Router();

// Save cart items
router.post('/save-cart',saveCart );
router.post('/get-cart',getCart);
router.post('/delete-cart',deleteCart);

export default router;