import axios from "axios";
import Order from "../models/order.js";
import User from "../models/user.js";
import Product from "../models/product.js";

export const getDashboard = async (req, res) => {
  try {
    // Fetch counts and totals in parallel using Promise.all
    const [ordersCount, totalCompletedOrders, totalUsers, totalProducts] =
      await Promise.all([
        Order.countDocuments({}),
        Order.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" },
            },
          },
        ]),

        User.distinct("userId").countDocuments(),
        Product.distinct("productId").countDocuments(),
      ]);
    const ordersArray = await Order.find({});
    const usersArray = await User.find({});
    const productsArray = await Product.find({});
    const grandTotal = totalCompletedOrders[0]?.total || 0;
    const avgOrderValue = (
      ordersCount > 0 ? grandTotal / ordersCount : 0
    ).toFixed(2);

    res.status(200).json({
      ordersCount,
      grandTotal,
      avgOrderValue,
      totalUsers,
      totalProducts,
      orders: ordersArray,
      users: usersArray,
      products: productsArray,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export default { getDashboard };
