const mongoose = require('mongoose');
const Product = require('./productSchema'); // Import the Product model

// סכמה למוצרים בתוך ההזמנה
const productSchemaInOrder = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  img: { type: Array, required: true }, // שמירת תמונות המוצר
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

// סכמה להזמנה
const orderSchema = new mongoose.Schema({
  productArr: [productSchemaInOrder], // מערך מוצרים עם כל הפרטים
  userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  status: { type: String, required: true },
  totalSum: { type: Number, required: true },
  address: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
