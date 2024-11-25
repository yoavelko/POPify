const User = require('../models/userSchema');
const Product = require('../models/productSchema');

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // בדיקת שדות חובה
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      // חיפוש משתמש לפי אימייל וסיסמה
      const user = await User.findOne({ email, password });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // בדיקה אם המשתמש הוא מנהל
      const isAdmin = user.isAdmin || false;
  
      // החזרת תגובה עם הודעת הצלחה וסטטוס מנהל
      res.status(200).json({ 
        message: "Login successful", 
        user: { 
          id: user._id, 
          email: user.email, 
          name: user.name, 
          isAdmin: isAdmin // הוספת שדה isAdmin בתגובה
        }
      });
    } catch (error) {
      console.error("Error during login:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
exports.createNewUser = async (req, res) => {
    console.log("Request body:", req.body);
    try {
        const { name, lastName, email, password, address, isAdmin } = req.body;

        // Validate required fields
        if (!name || !lastName || !email || !password) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        // Create a new user instance
        const newUser = new User({
            name,
            lastName,
            email,
            password, // No hashing, storing as plain text
            address: address || "", // Optional field
            cart: [],
            wishList: [],
            history: [],
            isAdmin: isAdmin || false, // Default to false if not provided
            isDeleted: false // Default to false
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Send success response
        res.status(201).json({
            message: "User created successfully",
            user: savedUser
        });
    } catch (error) {
        console.error("Error creating new user:", error.message);

        // Send only the error message to avoid circular references
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



exports.addToWishList = async (req, res) => {
    try {
        const { userId, productId } = req.body;  // Extract userId and productId from the request body

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Add the product's ObjectId to the user's cart array
        user.wishList.push(product._id);

        // Save the updated user document
        await user.save();

        res.status(200).json({
            message: "Product added to wish list successfully",
            wishList: user.wishList
        });
    } catch (error) {
        console.error("Error adding product to cart:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
   

exports.removeFromWishList = async (req,res) => {
    try{
        const {userId,productId}= req.body;
        if(!userId || !productId)
            return res.status(400).json({message:"User ID and Product ID are required"});

        const user = await User.findById(userId);
        if(!user)
            return res.status(404).json({message:"User not found"});

        const productIndex = user.wishList.indexOf(productId);
        if (productIndex === -1)
            return res.status(400).json({message:"Product not found in wishlist"});

        user.wishList.splice(productIndex, 1);
        await user.save();
        res.status(200).json({message:"Product removed from wishlist successfully"});
        wishList = user.wishList;
    }
    catch(error){
        console.error("Error removing product from wishlist:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.updateUser = async (req, res) => {

    try {
        const { userId, name, lastName, email, password, address } = req.body; // Extract data from request body

        // Find the user by ID and update the specified fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                ...(name && { name }),
                ...(lastName && { lastName }),
                ...(email && { email }),
                ...(password && { password }),
                ...(address && { address })
            },
            { new: true } // Return the updated document
        );

        // If the user is not found
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with the updated user data
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }

};

exports.addToCart = async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      // בדיקת תקינות קלט
      if (!userId || !productId) {
        return res.status(400).json({ message: "userId and productId are required" });
      }
  
      // שליפת המשתמש מהמסד
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // הוספת המוצר למערך cart
      user.cart.push(productId);
      await user.save();
  
      res.status(200).json({
        message: "Product added to cart successfully",
        cart: user.cart,
      });
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };  


exports.removeFromCart = async (req, res) => {
    console.log('here')
    try {
        const { userId, productId } = req.body;  // Extract userId and productId from the request body

        // Validate required fields
        if (!userId || !productId) {
            return res.status(400).json({ message: "userId and productId are required" });
        }

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove the productId from the cart array
        const productIndex = user.cart.indexOf(productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in user's cart" });
        }

        user.cart.splice(productIndex, 1);  // Remove the productId from the cart array

        // Save the updated user document
        await user.save();

        res.status(200).json({
            message: "Product removed from cart successfully",
            cart: user.cart
        });
    } catch (error) {
        console.error("Error removing product from cart:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



exports.searchProducts = async (req, res) => {
    try {
        const { searchTerm } = req.body;  // Extract search term from the request body

        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }

        // Perform a case-insensitive search using regex
        const products = await Product.find({
            name: { $regex: searchTerm, $options: 'i' }  // 'i' for case-insensitive
        });

        // Respond with the list of products
        res.status(200).json({
            message: "Products retrieved successfully",
            products
        });
    } catch (error) {
        console.error("Error searching for products:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();

        // Respond with the array of user objects
        res.status(200).json({
            message: "Products retrieved successfully",
            products
        });
    } catch (error) {
        console.error("Error retrieving products:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getProductsByCategory = async (req, res) => {
    try {
        // Fetch all products from the database grouped by category
        const products = await Product.aggregate([
            {
                $group: {
                    _id: "$category", // קיבוץ לפי השדה category
                    products: { $push: "$$ROOT" } // דחיפה של כל המסמך לתוך מערך products
                }
            }
        ]);

        // Respond with the array of products grouped by category
        res.status(200).json({
            message: "Products grouped by category retrieved successfully",
            products
        });
    } catch (error) {
        console.error("Error retrieving products by category:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getCart = async (req, res) => {
    console.log("Request received for getCart:", req.params);

    try {
        const { userId } = req.params; // Extract userId from the request parameters

        // Find the user by userId and populate the cart with product details
        const user = await User.findById(userId).populate("cart");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Cart retrieved successfully",
            cart: user.cart, // Return populated cart
        });
    } catch (error) {
        console.error("Error retrieving cart:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getWishlist = async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from the request parameters

        // Find the user by userId and populate the wishlist with product details
        const user = await User.findById(userId).populate("wishList");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Wishlist retrieved successfully",
            wishList: user.wishList, // Return populated wishlist
        });
    } catch (error) {
        console.error("Error retrieving wishlist:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


