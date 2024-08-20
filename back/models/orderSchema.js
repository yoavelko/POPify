const mongoose = require('mongoose');
const Product = require('./productSchema'); // Import the Product model

const orderSchema = new mongoose.Schema({
    prodcutArr: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    userId: {type: mongoose.Types.ObjectId},
    status: {type: String, required: true},
    totalSum: {type: Number, required: true},
    address: {type: String, required: true}
});

module.exports = mongoose.model('Order', orderSchema);