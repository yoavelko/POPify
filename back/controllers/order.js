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
    // שליפת כל המוצרים
    const products = await Product.find();

    // יצירת מערך מוצרים עם ערכי פופולריות מאופסים
    const productPopularity = products.map(product => ({
      _id: product._id.toString(),
      name: product.name || "Unknown Product",
      price: product.price || 0,
      category: product.category || "Uncategorized",
      img: product.img||[],
      purchaseCount: 0
    }));

    // שליפת כל ההזמנות
    const orders = await Order.find();

    // עדכון הפופולריות לפי הזמנות
    orders.forEach(order => {
      order.productArr.forEach(productInOrder => {
        const product = productPopularity.find(p => p._id === productInOrder.productId.toString());
        if (product) {
          product.purchaseCount += productInOrder.quantity;
        }
      });
    });

    res.status(200).json(productPopularity);
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

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.query.id; // שים לב ל-id מה-query, לא מ-body
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const orders = await Order.find({ userId }).exec();
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

exports.getOrdersPerCustomer = async (req, res) => {
  try {
    const customerOrders = await Order.aggregate([
      {
        $group: {
          _id: "$userId", // קיבוץ לפי מזהה המשתמש
          totalOrders: { $sum: 1 } // ספירת כמות ההזמנות
        }
      },
      {
        $lookup: {
          from: "users", // שם אוסף המשתמשים
          localField: "_id", // מזהה המשתמש באוסף ההזמנות
          foreignField: "_id", // מזהה המשתמש באוסף המשתמשים
          as: "userDetails" // שם השדה שבו יישמרו פרטי המשתמשים
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true // כולל משתמשים ללא פרטים
        }
      },
      {
        $project: {
          _id: 1, // מזהה המשתמש
          totalOrders: 1, // כמות ההזמנות
          fullName: {
            $concat: [
              { $ifNull: ["$userDetails.name", "Unknown"] }, // שם פרטי או "Unknown"
              " ",
              { $ifNull: ["$userDetails.lastName", ""] } // שם משפחה או ריק
            ]
          }
        }
      },
      { $sort: { totalOrders: -1 } } // מיון לפי כמות ההזמנות
    ]);

    res.status(200).json(customerOrders);
  } catch (error) {
    console.error("Error fetching orders per customer:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
