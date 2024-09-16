// models/Order.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;
// const mongoose = require("mongoose");
const orderItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Assuming you have a Product model
    required: true,
  },
  image:{
    type: String
  },
  title: {
    type: String
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

const orderSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  orderID: { type: String, required: true }, // PayPal order ID
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Order", orderSchema);
