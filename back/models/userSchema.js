const mongoose = require('mongoose');
const Product = require('./productSchema'); // Import the Product model
const Order = require('./orderSchema'); // Import the Order model (assuming you have it set up)

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Reference to Product model
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Reference to Product model
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Reference to Order model
    isAdmin: { type: Boolean, default: false, required: true },
    isDeleted: { type: Boolean, default: false, required: true }
});

module.exports = mongoose.model('User', userSchema);
