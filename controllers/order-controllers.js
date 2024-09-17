import Order from "../models/order.js";
import Cart from "../models/cart.js";
import HttpError from "../models/http-error.js";
import mongoose from "mongoose";
import axios from "axios";

export const createOrder = async (req, res) => {
  console.log("it came");
  const { userId, items, totalAmount, orderID } = req.body;
  console.log(userId);
  try {
    // Create a new order in the database
    const newOrder = new Order({
      userId,
      orderID,
      items,
      totalAmount,
    });

    await newOrder.save();
    if (res.status(200)) {
      console.log("Order created successfully");
    }
    res.status(200).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

const getAccessToken = async () => {
  try {
    const response = await axios({
      url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username:
          "AdfJi2SLHz10OCfO8eA8G1JJO5WwebX0o9DXT-j6dRaQ5JIjhyV9a5m2rDvw31ObKRJUZbbnCj_vTGqY",
        password:
          "EFvZdJTqr4e5KV-38yZbSN0hi-zy5RZ_O2B8e4cHnsxHZl_L3RcE96BsNqhad3X_5YczGmhsWJ_SayCG",
      },
      data: "grant_type=client_credentials",
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Failed to retrieve PayPal access token");
  }
};

export const verifyPayment = async (req, res) => {
  const { orderID } = req.params;
  console.log("entered in verify");

  try {
    const accessToken = await getAccessToken();
    console.log("token generated");
    const response = await axios.get(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);
    if (response.data.status === "COMPLETED") {
      // Payment completed successfully
      const order = await Order.findOneAndUpdate(
        { orderID },
        { status: "✅Paid" }
      );
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const cart = await Cart.findOneAndUpdate(
        { userId: order.userId },
        { $set: { items: [] } }
      );
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      await cart.save();
      res.status(200).json(response.data);
    } else {
      // Payment not completed
      const order = await Order.findOneAndUpdate(
        { orderID },
        { status: "❌Failed" }
      );
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    const order = await Order.findOneAndUpdate(
      { orderID },
      { status: "❌Failed" }
    );
    if (order) {
      await order.save();
    }
    res.status(500).json({ message: "Error verifying payment" });
  }
};

export const getOrders = async (req, res) => {
  const { userId } = req.query;
  const order = await Order.find({ userId: userId });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  console.log("order is sent");
  const orderData = order.map((order) => {
    return {
      orderId: order.orderID,
      total: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    };
  })
  res.status(200).json(orderData);
};
export const getOrderById = async (req, res) => {
  const {orderId} = req.query;
  const order = await Order.findOne({orderID: orderId});
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  console.log("order is sent by id");
console.log(order.items);
  res.status(200).json(order.items);
}
export default { createOrder, verifyPayment , getOrders, getOrderById};
