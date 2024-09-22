import Cart from "../models/cart.js";
import HttpError from "../models/http-error.js";
import mongoose from "mongoose";
  export const saveCart = async (req, res) => {
    const { userId, items, totalPrice } = req.body;
  
    try {
      let cart = await Cart.findOne({ userId: userId });
  
      if (cart) {
        const itemIds = new Set(items.map((item) => item.productId.toString()));
  
        // Filter out items not in the new list
        cart.items = cart.items.filter((cartItem) =>
          itemIds.has(cartItem.productId.toString())
        );
  
        req.body.items.forEach((newItem) => {
          if (!newItem.productId) {
            console.error("Error: productId is missing for one of the items:", newItem);
            throw new Error("Validation failed: productId is required.");
          }
  
          const existingItem = cart.items.find((item) =>
            item.productId.toString() === newItem.productId
          );
  
          if (existingItem) {
            // Update quantity if the product already exists
            existingItem.quantity = Math.max(newItem.quantity, 1);
          } else {
            // Add the new product to the cart
            cart.items.push(newItem);
          }
        });
  
        cart.totalPrice = req.body.totalPrice; // Update total price
  
        // Ignore versioning conflict
        await Cart.updateOne(
          { _id: cart._id },
          { items: cart.items, totalPrice: cart.totalPrice },
          { upsert: true }
        );
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
      console.error("Error saving cart:", error);
      res.status(500).json({ message: error.message });
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
