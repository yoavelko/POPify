const User = require('../models/userSchema');
const Order = require('../models/orderSchema');

exports.createOrder = async (req, res) => {
  try {
    const { productArr, userId, status, totalSum, address } = req.body;

    if (!productArr || !userId || !status || !totalSum || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = new Order({
      productArr,
      userId,
      status,
      totalSum,
      address
    });

    const savedOrder = await newOrder.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { history: savedOrder._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Order created successfully and user history updated",
      order: savedOrder
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;  // Extract orderId and new status from request body

        // Validate input
        if (!orderId || !status) {
            return res.status(400).json({ message: "Order ID and status are required" });
        }

        // Find and update the order status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },  // Update status field
            { new: true, runValidators: true }  // Return the updated document and apply schema validators
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Respond with the updated order
        res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        console.error("Error updating order status:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};