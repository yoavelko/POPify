const User = require('../models/userSchema');
const Product = require('../models/productSchema');
const Order = require('../models/orderSchema');

exports.createProduct = async (req, res) => {
  try {
    const { name, img, price, category } = req.body;

    // Validate fields
    if (!name || !img || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate img as an array with two items
    if (!Array.isArray(img) || img.length !== 2) {
      return res.status(400).json({ message: "Two images are required" });
    }

    // Validate Google Drive links
    const googleDriveLinkRegex = /^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view$/;
    if (!googleDriveLinkRegex.test(img[0]) || !googleDriveLinkRegex.test(img[1])) {
      return res.status(400).json({ message: "Both images must be valid Google Drive links" });
    }

    // Create product
    const newProduct = new Product({ name, img, price, category });
    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;  // קבלת ה-id מתוך הנתיב במקום מגוף הבקשה

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // מחיקת המוצר על פי id
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: result
    });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, img, price, category } = req.body;  // שים לב שאין שימוש ב-req.body.productId

    const updateFields = {};
    if (name) updateFields.name = name;
    if (img) updateFields.img = img;
    if (price) updateFields.price = price;
    if (category) updateFields.category = category;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Respond with the array of user objects
    res.status(200).json({
      message: "Users retrieved successfully",
      users
    });
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (userEmail === "") {
      const users = await userService.getAllUsers();
      res.json({
        user: users,
        array: true,
      });
    } else {
      const user = await userService.findUser(userEmail);
      if (user) {
        res.json({
          user: user,
          array: false,
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    }
  } catch (error) {
    console.log("Error in findUser: ", error.message);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;  // Extract userId from the request body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find and update the user by userId
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },  // Update isDeleted field to true
      { new: true, runValidators: true }  // Return the updated document and run schema validators
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user object
    res.status(200).json({
      message: "User marked as deleted successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error marking user as deleted:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete the order', error });
  }
};

exports.logOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session: ", err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
};

exports.updateUserforA = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const updatedData = req.body;

    // עדכון הנתונים במסד
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true, // מחזיר את הרשומה המעודכנת
      runValidators: true, // מבצע ולידציה על הנתונים
    });

    // אם המשתמש לא נמצא
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("Updated user data:", updatedUser);

    // תגובה ללקוח
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.postOnFacebook = async (req, res) => {


  const pageAccessToken = 'EAAH3RlCEek8BO4MNJoODvvUwy2BOvyPvml7NUxi6vAL5WvbdxqZCXOlrqCk6aaxSZCy3vGMhVh9ZB4hc12nmM0xunzZAZCf0j0NlevHY6NwyoTpTKwazj2qVHKG6PltMQXv73fjYOk0EElRM5gbvcLgBpOEpl9pAlq3uB7nVpfoZBk3d8sH98CMyo7tUl1tBRfZB1tHUu5kiygtHz6P';
  const pageId = '489219224276581';
  const product = await Product.findOne({ _id: req.body.id });
  const message = `Check out our new product:`;
  const imageUrl = 'https://c1-ebgames.eb-cdn.com.au/merchandising/images/packshots/12b7af8d45e44fdd81cd5fba5376a443_Large.jpg';

  try {
    const response = await fetch(
      `https://graph.facebook.com/${pageId}/photos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: imageUrl,
          caption: message,
          access_token: pageAccessToken,
        }),
      }
    );

    if (response.ok) {
      console.log("Post uploaded successfully to Facebook");
    } else {
      console.log("Error while posting to Facebook:", response);
    }
  } catch (error) {
    console.log('Error posting on faceook:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}