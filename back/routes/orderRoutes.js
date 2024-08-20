const express = require('express');
const router = express.Router();
const { createOrder, updateOrderStatus } = require('../controllers/order');

router.post('/new-order', createOrder);
router.patch('/update-status', updateOrderStatus);

module.exports = router;