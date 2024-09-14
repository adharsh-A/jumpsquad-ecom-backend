import Cart from "../models/cart.js";
import HttpError from "../models/http-error.js";
import mongoose from "mongoose";
export const saveCart = async (req, res) => {
  const { userId, items, totalPrice } = req.body;

  /*   console.log("req.body.userId", userId);
   */
  // Find the cart for the user

  try {
    let cart = await Cart.findOne({ userId: userId });

    if (cart) {
      // If cart exists, merge the new items
      /*       cart.items.forEach((item) => {
        console.log("cart items id", item.productId);
      }) */
      const itemIds = new Set(items.map((item) => item.productId.toString()));

      // Remove items that are not in the new list
      cart.items = cart.items.filter((cartItem) =>
        itemIds.has(cartItem.productId.toString())
      );

      req.body.items.forEach((newItem) => {
        if (!newItem.productId) {
          console.error(
            "Error: productId is missing for one of the items:",
            newItem
          );
          throw new Error("Validation failed: productId is required.");
        }
        const existingItem = cart.items.find((item) => {
          let objectToS = item.productId.toString();
          return objectToS === newItem.productId;
        });

        if (existingItem) {
          // Update quantity if the product already exists
          existingItem.quantity = Math.max(newItem.quantity, 1);
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
    res.status(500).json({ message: "Failed to delete cart" });
  }
};
export const getCart = async (req, res) => {
  const { userId } = req.body;
  console.log(userId);

  try {
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(200).json({ message: "Cart is Empty" });
    }

    res.status(200).json({
      items: cart.items.map((item) => ({
        id: item.productId,
        title: item.title,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get cart" });
  }
};

export default { saveCart, deleteCart, getCart };
