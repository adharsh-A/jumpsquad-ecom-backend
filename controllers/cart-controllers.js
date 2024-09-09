import Cart from "../models/cart.js";
import HttpError from "../models/http-error.js";

export const saveCart = async (req, res) => {
  const { userId, items, totalPrice } = req.body;

  // Find the cart for the user
  let cart = await Cart.findOne({ userId: req.body.userId });
  try {
    if (cart) {
      // If cart exists, merge the new items
      console.log(req.body.items);
      req.body.items.forEach((newItem) => {
        if (!newItem.productId) {
          console.error(
            "Error: productId is missing for one of the items:",
            newItem
          );
          throw new Error("Validation failed: productId is required.");
        }
        const existingItem = cart.items.find((item) => item.productId === newItem.productId);

        if (existingItem) {
          // Update quantity if the product already exists
          existingItem.quantity = Math.max(
            existingItem.quantity + newItem.quantity,
            1
          );
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
        userId,
        items,
        totalPrice,
      });

      await cart.save();
    }
    res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    throw error;
  }
};
export const deleteCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOneAndDelete({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete cart" });
  }
};
export const getCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(200).json({ message: "Cart is Empty" });
    }

    res.status(200).json({ cart: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get cart" });
  }
};
export const deleteItem = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: { productId:productId } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return next(new HttpError("Failed to delete item", 500));
  }
};
export default { saveCart, deleteCart, getCart, deleteItem };
