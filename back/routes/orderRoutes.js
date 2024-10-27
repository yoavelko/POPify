const express = require('express');
const router = express.Router();
const Order = require('./orderSchema'); // Import your Order model

router.post('/orders', async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = new Order(orderData);
        await newOrder.save(); // Save the order in the database
        res.status(201).send(newOrder); // Send back the created order
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;