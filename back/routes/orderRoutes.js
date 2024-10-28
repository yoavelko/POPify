const express = require('express');
const router = express.Router();
const Order = require('../models/orderSchema');

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).exec();
    res.json(order);
  } catch (error) {
    res.status(500).send('Error fetching order');
  }
});


module.exports = router;