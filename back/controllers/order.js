const User = require('../models/userSchema');
const Order = require('../models/orderSchema');
const Product = require('../models/productSchema'); // נוודא שגם סכימת Product מיובאת

// יצירת הזמנה חדשה
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

    // עדכון היסטוריית המשתמש
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

// עדכון סטטוס ההזמנה
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: "Order ID and status are required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProductsWithPopularity = async (req, res) => {
  try {
    // חישוב כמות הרכישות לכל מוצר
    const productPopularity = await Order.aggregate([
      { $unwind: "$productArr" },
      { 
        $group: {
          _id: "$productArr", 
          purchaseCount: { $sum: 1 }
        }
      }
    ]);

    // אחזור כל המוצרים
    const products = await Product.find();

    // שילוב כמות הרכישות עם פרטי המוצרים
    const productsWithPopularity = products.map(product => {
      const popularity = productPopularity.find(p => p._id.toString() === product._id.toString());
      return {
        ...product.toObject(),
        purchaseCount: popularity ? popularity.purchaseCount : 0
      };
    });

    res.status(200).json(productsWithPopularity);
  } catch (error) {
    console.error("Error retrieving products with popularity:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getOrder= async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).exec();
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.json(order);
  } catch (error) {
    res.status(500).send('Error fetching order');
  }
};

