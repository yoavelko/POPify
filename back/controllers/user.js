const User = require('../models/userSchema');
const Product = require('../models/productSchema');


exports.createNewUser = async (req, res) => {
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
        const { userId, productId } = req.body;
        if (!userId || !productId)
            return res.status(400).json({ message: "User ID and Product ID are required" });

        const user = await User.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        if (user.wishList.includes(productId))
            return res.status(400).json({ message: "Product is already in the wishlis" });

        user.wishList.push(productId);
        await user.save();

        res.status(200).json({
            message: "Product added to wishlist successfully",
            wishList: user.wishList
        });
    }
    catch (error){
        console.error("Error adding product to wishlist:", error.message);
        res.status(500).json({message:"Server error", error: error.message })
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