const User = require('../models/userSchema');
const Product = require('../models/productSchema');
const Order = require('../models/orderSchema');

exports.createOrder = async (req, res) => {
    try {
        const { prodcutArr, userId, status, totalSum, address } = req.body;  // Extract order details from request body

        // Validate input
        if (!prodcutArr || !userId || !status || !totalSum || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new order instance
        const newOrder = new Order({
            prodcutArr,
            userId,
            status,
            totalSum,
            address
        });

        // Save the new order to the database
        const savedOrder = await newOrder.save();

        // Update the user's history with the new order ID
        await User.findByIdAndUpdate(
            userId,
            { $push: { history: savedOrder._id } },  // Add the new order ID to the history array
            { new: true }  // Return the updated user document
        );

        // Respond with the created order
        res.status(201).json({
            message: "Order created successfully and user history updated",
            order: savedOrder
        });
    } catch (error) {
        console.error("Error creating order and updating user history:", error.message);
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