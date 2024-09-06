// routes/cart.js
import express from 'express';
import Cart from '../models/cart.js';
import saveCart from '../controllers/cart-controllers.js';
const router = express.Router();

// Save cart items
router.post('/save-cart',saveCart );

export default router;