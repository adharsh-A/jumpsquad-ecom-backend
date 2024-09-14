import HttpError from "../models/http-error.js";
import product from "../models/product.js";
import Wishlist from "../models/wishlist.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export const getWishlist = async (req, res) => {
  const { id } = req.body; // Access userId from query parameters
  console.log("getWishlist:", id);

  const wishlist = await Wishlist.findOne({
    userId: id,
  });
  if (wishlist) {
      const itemsData = wishlist.items.map((item) => ({
          productId: item.productId,
          image: item.image,
          price: item.price,
          title: item.title,
        }));
        console.log("wishlist sent");
    res.status(200).json({
      items:itemsData,
    });
  } else {
    console.log("wishlist not found");
    res.status(500).json({ message: "wishlist not found" });
  }
};

export const addToWishlist = async (req, res) => {
  const { userId, items } = req.body;
  try {
    const wishlist = await Wishlist.findOne({ userId: userId });
    if (wishlist) {
      wishlist.items = items; // Set wishlist.items to the items from the request
      await wishlist.save();
      res.status(200).json({ message: "Wishlist updated successfully" });
    } else {
      const newWishlist = new Wishlist({
        userId: userId,
        items: items,
      });
      await newWishlist.save();

      res.status(200).json({ message: "Wishlist created successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add product to wishlist" });
  }
};
export default { getWishlist, addToWishlist };
