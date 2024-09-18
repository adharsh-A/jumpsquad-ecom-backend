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

    const grandTotal = totalCompletedOrders[0]?.total || 0;
    const avgOrderValue = (
      ordersCount > 0 ? grandTotal / ordersCount : 0
    ).toFixed(2);

      const response = await axios.get(
        "https://jumpsquad.vercel.app/_vercel/insights/view",
        {
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_ANALYTICS_TOKEN}`, // Replace with your actual API token if needed
          },
        }
      );
      const analyticsData = response.data;
      console.log("Analytics data:", analyticsData);
    res.status(200).json({
      ordersCount,
      grandTotal,
      avgOrderValue,
      totalUsers,
      totalProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export default { getDashboard };
