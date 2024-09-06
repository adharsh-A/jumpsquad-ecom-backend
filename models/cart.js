// models/Cart.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Assuming you have a Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
});

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    items: [cartItemSchema], // Array of cart items
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Cart", cartSchema);
