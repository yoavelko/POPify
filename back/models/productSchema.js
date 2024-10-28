const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: Array, required: true, unique: true },
    price: { type: Number, required: true , min:0},
    category: { type: String, required: true, enum:['Marvel, DC, Disney'] },
    numLikes: { type: Number, default:0}
});

module.exports = mongoose.model('Product', productSchema);