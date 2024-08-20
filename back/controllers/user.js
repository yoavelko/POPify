const User = require('../models/userSchema');

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
