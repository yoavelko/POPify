const express = require('express');
const router = express.Router();
const Order = require('../models/orderSchema');
const { createOrder } = require('../controllers/order');

// יצירת הזמנה חדשה
router.post('/', createOrder);

// קבלת הזמנה לפי מזהה
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).exec();
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.json(order);
  } catch (error) {
    res.status(500).send('Error fetching order');
  }
});

module.exports = router;
