import expess from "express";
import { getWishlist, addToWishlist } from "../controllers/wishlist-controllers.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
const router = expess.Router();



router.post("/get-wishlist", getWishlist);
router.post("/add", addToWishlist);

export default router;  