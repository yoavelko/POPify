const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    numLikes: { type: Number }
});

module.exports = mongoose.model('Product', productSchema);