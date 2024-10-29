const User = require('../models/userSchema');
const Product = require('../models/productSchema');  // Adjust the path to your Product model

exports.createProduct = async (req, res) => {
    try {
        const { name, img, price, category } = req.body;  // Extract product details from the request body

        // Validate required fields
        if (!name || !img || !price || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Ensure img is an array
        if (!Array.isArray(img)) {
            return res.status(400).json({ message: "Image links should be an array" });
        }

        // Create a new product instance
        const newProduct = new Product({
            name,
            img,  // img is expected to be an array of image URLs
            price,
            category
        });

        // Save the new product to the database
        await newProduct.save();

        // Respond with the newly created product
        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
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
exports.logOut = async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Error destroying session: ", err);
        return res.redirect("/");
      }
      res.redirect("/login");
    });
  };