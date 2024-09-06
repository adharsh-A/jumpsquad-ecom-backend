import Cart from "../models/cart.js";
import HttpError from "../models/http-error.js";

export const saveCart = async (req, res) => {
  const { userId, items, totalPrice } = req.body;
  // Find the cart for the user
  let cart = await Cart.findOne({ userId: req.body.userId });
  try {
    if (cart) {
      // If cart exists, merge the new items
      req.body.items.forEach((newItem) => {
        const existingItem = cart.items.find(
          (item) => item.productId.toString() === newItem.productId.toString()
        );

        if (existingItem) {
          // Convert quantities to numbers before adding
          // Update quantity if the product already exists
          existingItem.quantity = newItem.quantity;
        } else {
          // Add the new product to the cart
          cart.items.push(newItem);
        }
      });

      cart.totalPrice = req.body.totalPrice; // Recalculate total price
      await cart.save();
    } else {
      // If no cart exists, create a new one
      cart = new Cart({
        userId: req.body.userId,
        items: req.body.items,
        totalPrice: req.body.totalPrice,
      });

      await cart.save();
    }
    res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    console.error(error);
    return next(new HttpError("Failed to save cart", 500));
  }
};
export default saveCart;
